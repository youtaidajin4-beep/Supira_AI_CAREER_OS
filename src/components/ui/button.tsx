import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white shadow-xs hover:bg-accent-hover active:scale-[0.98]",
  secondary:
    "border border-border bg-background text-foreground shadow-xs hover:bg-background-subtle active:scale-[0.98]",
  ghost:
    "text-foreground-secondary hover:bg-background-subtle hover:text-foreground",
  danger:
    "bg-danger text-white shadow-xs hover:bg-danger/90 active:scale-[0.98]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-10 px-5 text-sm gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 focus-ring disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md"
) {
  return cn(
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 focus-ring",
    variants[variant],
    sizes[size]
  );
}
