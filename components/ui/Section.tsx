import { cn } from "@/lib/cn";

type Props = {
  id?: string;
  title?: string;
  lead?: string;
  tone?: "default" | "surface" | "brand";
  className?: string;
  children: React.ReactNode;
};

// Обёртка блока страницы: отступы, ширина, заголовок H2
export function Section({ id, title, lead, tone = "default", className, children }: Props) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 py-12 md:py-16",
        tone === "surface" && "bg-surface",
        tone === "brand" && "bg-brand-soft",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-(--container-site) px-4 md:px-6">
        {title && <h2 className="text-h2 font-extrabold md:text-4xl">{title}</h2>}
        {lead && <p className="text-ink-muted mt-3 max-w-2xl text-lg">{lead}</p>}
        <div className={cn(title || lead ? "mt-8" : undefined)}>{children}</div>
      </div>
    </section>
  );
}

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("mx-auto w-full max-w-(--container-site) px-4 md:px-6", className)}>{children}</div>
  );
}
