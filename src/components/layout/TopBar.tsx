import { cn } from "@/lib/utils/cn";

interface TopBarProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

export function TopBar({
  title,
  description,
  actions,
  className,
  sticky = true,
}: TopBarProps) {
  return (
    <header
      className={cn(
        "border-b border-border bg-background/80 backdrop-blur-md",
        sticky && "sticky top-0 z-10",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4 px-6 py-5 lg:px-8">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm leading-relaxed text-foreground-muted">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </header>
  );
}
