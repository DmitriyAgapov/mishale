import { cva, type VariantProps } from "class-variance-authority";

// Классы кнопки — для <a>, <Link> и <button> одинаково
export const button = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-5 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-brand text-white hover:bg-brand-hover",
        secondary: "border border-line bg-surface text-ink hover:border-brand hover:text-brand",
        whatsapp: "bg-whatsapp text-white hover:brightness-110",
        ghost: "text-brand underline-offset-4 hover:underline",
      },
      size: {
        md: "",
        lg: "min-h-13 px-6 text-lg",
      },
      full: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonVariants = VariantProps<typeof button>;
