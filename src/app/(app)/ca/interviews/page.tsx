"use client";

import { CAInterviewPage } from "@/components/ca/CAInterviewPage";
import { CAPageFrame } from "@/components/ca/CAPageFrame";

export default function CAInterviewsPage() {
  return (
    <CAPageFrame
      title="面談入力"
      description="メモまたは録音 → AI解析 → 保存（30秒で完了を目指す）"
      showAssistant={false}
    >
      <CAInterviewPage />
    </CAPageFrame>
  );
}
