#!/usr/bin/env bash
# Выкладка сайта на VPS: сборка здесь, на сервер — готовый релиз.
# Запуск из папки site (Git Bash):  bash scripts/deploy.sh
# Сервер настроен по docs/SERVER.md: пользователь deploy, /srv/mishale, сервис mishale (systemd), nginx.
set -euo pipefail

HOST="${DEPLOY_HOST:-deploy@45.15.252.47}"
APP=/srv/mishale
KEEP=3
REL=$(date +%Y%m%d-%H%M%S)
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

cd "$(dirname "$0")/.."

if [ -n "$(git status --porcelain)" ]; then
  echo "Внимание: есть незакоммиченные изменения — они попадут в релиз." >&2
fi
COMMIT=$(git rev-parse --short HEAD)

echo "== Сборка ($COMMIT)"
# Демо-режим на рабочем сайте не включается: пустое значение перекрывает .env.local
DEMO_CONTENT= npm run build

echo "== Архив релиза $REL"
tar -czf "$TMP/release.tgz" \
  --exclude=.next/cache --exclude=.next/dev \
  .next public content package.json package-lock.json .npmrc next.config.ts redirects.ts
echo "$COMMIT" > "$TMP/REVISION"

echo "== Загрузка на $HOST"
# Диск сервера 9 ГБ: без запаса релиз распакуется не полностью
FREE_MB=$(ssh "$HOST" "df -Pm $APP | awk 'NR==2{print \$4}'")
if [ "$FREE_MB" -lt 1024 ]; then
  echo "На сервере свободно ${FREE_MB} МБ, нужно не меньше 1024. Освободите место (docs/SERVER.md)." >&2
  exit 1
fi
ssh "$HOST" "mkdir -p $APP/releases/$REL"
scp -q "$TMP/release.tgz" "$TMP/REVISION" "$HOST:$APP/releases/$REL/"

echo "== Установка и переключение"
ssh "$HOST" bash -s -- "$APP" "$REL" "$KEEP" <<'REMOTE'
set -euo pipefail
APP=$1; REL=$2; KEEP=$3
cd "$APP/releases/$REL"
tar -xzf release.tgz && rm release.tgz
PREV=$(readlink -f "$APP/current" 2>/dev/null || true)
# Пакеты не менялись — node_modules прошлого релиза жёсткими ссылками (~670 МБ не занимают место повторно)
if [ -n "$PREV" ] && [ -d "$PREV/node_modules" ] && cmp -s "$PREV/package-lock.json" package-lock.json; then
  cp -al "$PREV/node_modules" node_modules
  echo "Пакеты из прошлого релиза"
else
  npm ci --omit=dev --no-audit --no-fund --loglevel=error
  npm cache clean --force --loglevel=error
fi
ln -sfn "$APP/releases/$REL" "$APP/current"
sudo -n /usr/bin/systemctl restart mishale

ok=""
for i in $(seq 1 30); do
  if curl -fsS -o /dev/null http://127.0.0.1:3000/; then ok=1; break; fi
  sleep 1
done
if [ -z "$ok" ]; then
  echo "Сайт не ответил после запуска." >&2
  if [ -n "$PREV" ] && [ -d "$PREV" ]; then
    echo "Откат на $(basename "$PREV")" >&2
    ln -sfn "$PREV" "$APP/current"
    sudo -n /usr/bin/systemctl restart mishale
  fi
  exit 1
fi

# Старые релизы: оставляем последние $KEEP
ls -1d "$APP"/releases/*/ | sort | head -n -"$KEEP" | xargs -r rm -rf
echo "Релиз $REL ($(cat REVISION)) запущен"
REMOTE

echo "== Готово. Проверка: npm run smoke -- http://45.15.252.47 (после DNS и HTTPS — https://mishale74.ru)"
