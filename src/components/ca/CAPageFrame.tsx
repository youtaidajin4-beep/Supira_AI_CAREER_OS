import { TopBar } from "@/components/layout/TopBar";
import { CAPortalShell } from "@/components/ca/CAPortalShell";
import { CAScrollPane } from "@/components/ca/CAScrollPane";

interface CAPageFrameProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  showAssistant?: boolean;
  scrollClassName?: string;
  children: React.ReactNode;
}

/**
 * CA Portal 共通レイアウト。
 * TopBar + 単一スクロール領域（高さを flex で拘束する）
 */
export function CAPageFrame({
  title,
  description,
  actions,
  showAssistant = true,
  scrollClassName,
  children,
}: CAPageFrameProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <TopBar
        title={title}
        description={description}
        actions={actions}
        sticky={false}
        className="shrink-0"
      />
      <CAPortalShell showAssistant={showAssistant}>
        <CAScrollPane className={scrollClassName}>{children}</CAScrollPane>
      </CAPortalShell>
    </div>
  );
}
