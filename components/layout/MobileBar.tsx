import { Calculator, MessageCircle, Phone } from "lucide-react";
import { getSettings } from "@/lib/content";
import { LEAD_ANCHOR } from "./nav";

// Нижняя панель на телефоне: всегда видна, три главных действия
export async function MobileBar() {
  const s = await getSettings();
  const item = "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-semibold";
  return (
    <nav
      aria-label="Быстрая связь"
      className="border-line bg-surface fixed inset-x-0 bottom-0 z-40 flex border-t pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <a href={s.phone.href} className={item} data-goal="click_phone">
        <Phone className="text-brand size-5" aria-hidden />
        Позвонить
      </a>
      {s.whatsapp && (
        <a href={s.whatsapp} className={item} target="_blank" rel="noopener" data-goal="click_whatsapp">
          <MessageCircle className="text-whatsapp size-5" aria-hidden />
          WhatsApp
        </a>
      )}
      <a href={LEAD_ANCHOR} className={`${item} bg-brand text-white`}>
        <Calculator className="size-5" aria-hidden />
        Смета
      </a>
    </nav>
  );
}
