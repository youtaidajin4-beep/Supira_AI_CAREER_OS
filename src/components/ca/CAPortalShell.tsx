"use client";

import { CAAssistantPanel } from "@/components/ca/CAAssistantPanel";

interface CAPortalShellProps {
  children: React.ReactNode;
  /** 右サイドのAIアシスタントを表示 */
  showAssistant?: boolean;
}

export function CAPortalShell({
  children,
  showAssistant = true,
}: CAPortalShellProps) {
  return (
    <div className="flex min-h-0 flex-1 basis-0 overflow-hidden">
      <div className="flex min-h-0 min-w-0 flex-1 basis-0 flex-col overflow-hidden">
        {children}
      </div>
      {showAssistant && (
        <div className="hidden h-full min-h-0 w-[280px] shrink-0 lg:block">
          <CAAssistantPanel />
        </div>
      )}
    </div>
  );
}
