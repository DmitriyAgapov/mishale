import { DemoBadge } from "@/components/demo/Demo";
import type { Settings } from "@/lib/content/schemas";

// Реквизиты оператора персональных данных. Пока компания их не прислала — заметное предупреждение:
// без реквизитов сайт запускать нельзя (docs/STATUS.md, «Перед запуском»).
export function Operator({ settings }: { settings: Settings }) {
  const l = settings.legal;
  if (!l) {
    return (
      <p className="rounded-control bg-danger/10 text-danger p-4 font-semibold">
        Реквизиты оператора будут указаны до запуска сайта.
      </p>
    );
  }
  return (
    <p>
      {l.name}, ИНН {l.inn}, ОГРН {l.ogrn}
      {settings.address ? `, адрес: ${settings.address.text}` : ""}
      {settings.email ? `, e-mail: ${settings.email}` : ""}.
      <DemoBadge note={settings.demo.legal} label="пример реквизитов" />
    </p>
  );
}
