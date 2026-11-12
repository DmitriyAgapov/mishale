import { DemoBadge } from "@/components/demo/Demo";
import type { Settings } from "@/lib/content/schemas";

// Реквизиты оператора персональных данных. Без реквизитов — заметное предупреждение:
// без них сайт запускать нельзя (docs/STATUS.md, «Перед запуском»).
export function Operator({ settings }: { settings: Settings }) {
  const l = settings.legal;
  if (!l) {
    return (
      <p className="rounded-control bg-danger/10 text-danger p-4 font-semibold">
        Реквизиты оператора будут указаны до запуска сайта.
      </p>
    );
  }
  const address = l.address ?? settings.address?.text;
  return (
    <p>
      {l.name}, ИНН {l.inn}, ОГРН {l.ogrn}
      {address ? `, адрес: ${address}` : ""}
      {settings.email ? `, e-mail: ${settings.email}` : ""}
      {settings.phone ? `, телефон: ${settings.phone.display}` : ""}.
      <DemoBadge note={settings.demo.legal} label="пример реквизитов" />
    </p>
  );
}
