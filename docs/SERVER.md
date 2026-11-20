# Сервер сайта (VPS)

Настроен 20.11.2026. Вместо Amvera (решение пользователя от 20.11.2026).

## Машина

| Что          | Значение                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| Провайдер    | UltraVDS, DNS домена — `ns1.ultravds.com`, `ns2.ultravds.com`                                         |
| Адрес        | `45.15.252.47`                                                                                        |
| Система      | Ubuntu 26.04 LTS, 1 ядро, 1,5 ГБ памяти, swap 2,8 ГБ, диск 9,3 ГБ                                     |
| Часовой пояс | Asia/Yekaterinburg                                                                                    |
| Пароль root  | в `../vps.txt` (не в git); по SSH пароль не принимается, только через консоль VNC в панели провайдера |

## Доступ

- SSH только по ключу (`/etc/ssh/sshd_config.d/00-hardening.conf`: `PasswordAuthentication no`, `PermitRootLogin prohibit-password`). Ключ сейчас один — `~/.ssh/id_ed25519` компьютера исполнителя. Новый ключ — дописать в `~/.ssh/authorized_keys` нужного пользователя.
- `root` — администрирование. `deploy` — выкладка сайта; через sudo без пароля может только `systemctl restart|status mishale` и `journalctl -u mishale`.
- fail2ban для SSH: 5 попыток → бан на час.
- ufw: открыты только 22, 80, 443.
- Автообновления безопасности — `unattended-upgrades` (по умолчанию Ubuntu).

## Как устроен сайт

```
nginx :80/:443  →  127.0.0.1:3000  next start  (systemd: mishale, пользователь deploy)
```

| Путь                                  | Что                                                                |
| ------------------------------------- | ------------------------------------------------------------------ |
| `/srv/mishale/releases/<дата-время>/` | релизы, хранятся последние 3; в каждом `REVISION` — коммит         |
| `/srv/mishale/current`                | ссылка на работающий релиз                                         |
| `/etc/mishale/mishale.env`            | переменные сайта (`root:deploy`, 640), образец — `.env.example`    |
| `/etc/systemd/system/mishale.service` | сервис, `MemoryMax=1G`, перезапуск при падении                     |
| `/etc/nginx/sites-available/mishale`  | `mishale74.ru`, `www` и запросы по IP; кеш `/_next/static/` на год |

По IP сайт открывается, но закрыт от поиска (`X-Robots-Tag` в `proxy.ts` — всё, кроме `mishale74.ru` и `www`).

## Выкладка

```
bash scripts/deploy.sh
```

Сборка на компьютере исполнителя (на сервере мало памяти для `next build`), архив `.next` + `public` + `content` на сервер, там `npm ci --omit=dev`, переключение `current`, перезапуск, проверка `http://127.0.0.1:3000/`. Если сайт не ответил за 30 секунд — ссылка возвращается на прошлый релиз. Демо-режим собирается выключенным (`DEMO_CONTENT=` перекрывает `.env.local`).

После выкладки: `npm run smoke -- https://mishale74.ru` (или `http://45.15.252.47`, пока нет DNS).

Откат вручную на прошлый релиз:

```
ssh deploy@45.15.252.47
ls /srv/mishale/releases
ln -sfn /srv/mishale/releases/<прошлый> /srv/mishale/current && sudo systemctl restart mishale
```

## Переменные

```
ssh root@45.15.252.47
nano /etc/mishale/mishale.env      # YOUGILE_API_KEY, YOUGILE_COLUMN_ID и др. по .env.example
systemctl restart mishale
```

Сейчас заданы только `NODE_ENV=production` и `LEAD_TARGET=yougile` — заявки не доставляются, пока не добавлены ключи YouGile.

## HTTPS

Let's Encrypt, выпуск автоматический:

- `mishale-cert.timer` каждые 10 минут запускает `/usr/local/sbin/mishale-cert`: проверяет, что `mishale74.ru` и `www` указывают на `45.15.252.47` (у 8.8.8.8 и 77.88.8.8), и тогда выполняет `certbot --nginx -d mishale74.ru -d www.mishale74.ru --redirect`. certbot прописывает 443 и редирект с http в конфиг nginx. После выпуска таймер отключается сам.
- Без почты (`--register-unsafely-without-email`): письма об истечении Let's Encrypt с 2025 года не рассылает, продление автоматическое.
- Продление — штатный `certbot.timer` (дважды в сутки, продлевает за 30 дней до конца); после продления хук `/etc/letsencrypt/renewal-hooks/deploy/reload-nginx` перезагружает nginx.

Проверка:

```
ssh root@45.15.252.47
journalctl -u mishale-cert -n 5 --no-pager    # «ждём» или «Сертификат выпущен»
systemctl list-timers | grep -E "certbot|mishale"
certbot certificates                          # срок действия
certbot renew --dry-run                       # проверка продления
```

## Логи и состояние

```
ssh deploy@45.15.252.47 sudo journalctl -u mishale -n 100 --no-pager
ssh root@45.15.252.47 tail -n 50 /var/log/nginx/error.log
```
