import { cn } from "@/lib/utils/cn";

interface AnalysisCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "highlight";
}

export function AnalysisCard({
  title,
  children,
  className,
  variant = "default",
}: AnalysisCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-background p-4 shadow-xs transition-shadow hover:shadow-sm",
        variant === "highlight"
          ? "border-accent/20 bg-accent-subtle/30"
          : "border-border",
        className
      )}
    >
      <h4 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
        {title}
      </h4>
      <div className="text-[13px] leading-relaxed text-foreground-secondary">
        {children}
      </div>
    </div>
  );
}

export function TagList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2 text-[13px] leading-snug text-foreground-secondary"
        >
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
          {item}
        </li>
      ))}
    </ul>
  );
}
