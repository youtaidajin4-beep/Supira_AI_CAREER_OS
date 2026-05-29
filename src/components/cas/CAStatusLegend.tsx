import { cn } from "@/lib/utils/cn";

const items = [
  {
    key: "needs_support",
    label: "要支援",
    description: "フォローが必要",
    dot: "bg-warning",
    bg: "bg-warning-subtle",
  },
  {
    key: "good",
    label: "安定",
    description: "通常運用",
    dot: "bg-accent",
    bg: "bg-accent-subtle",
  },
  {
    key: "excellent",
    label: "好調",
    description: "高パフォーマンス",
    dot: "bg-success",
    bg: "bg-success-subtle",
  },
] as const;

export function CAStatusLegend() {
  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-border-subtle bg-white p-3 shadow-sm">
      <p className="w-full text-[11px] font-semibold text-foreground-muted sm:w-auto sm:mr-2 sm:self-center">
        ステータスの見方
      </p>
      {items.map((item) => (
        <div
          key={item.key}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-1.5",
            item.bg
          )}
        >
          <span className={cn("h-2.5 w-2.5 rounded-full", item.dot)} />
          <span className="text-xs font-semibold text-foreground">{item.label}</span>
          <span className="text-[10px] text-foreground-muted">{item.description}</span>
        </div>
      ))}
    </div>
  );
}
