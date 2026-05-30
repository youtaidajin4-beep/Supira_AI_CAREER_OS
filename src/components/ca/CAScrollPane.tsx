import { cn } from "@/lib/utils/cn";

interface CAScrollPaneProps {
  children: React.ReactNode;
  className?: string;
}

/** CA Portal 用のメインスクロール領域（ネストを減らし操作しやすくする） */
export function CAScrollPane({ children, className }: CAScrollPaneProps) {
  return (
    <div className={cn("ca-scroll-pane min-h-0 flex-1 basis-0", className)}>
      {children}
    </div>
  );
}
