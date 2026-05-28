"use client";

import { useState } from "react";
import type { AIAnalysis, Student } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";
import { AnalysisPanel } from "@/components/ai/AnalysisPanel";
import { BasicInfoTab } from "./tabs/BasicInfoTab";
import { InterviewHistoryTab } from "./tabs/InterviewHistoryTab";
import { EsTab } from "./tabs/EsTab";
import { InterviewStatusTab } from "./tabs/InterviewStatusTab";
import { ContactMemoTab } from "./tabs/ContactMemoTab";
import { NextActionTab } from "./tabs/NextActionTab";

const TABS = [
  { id: "basic", label: "基本情報" },
  { id: "interviews", label: "面談履歴" },
  { id: "ai", label: "AI分析" },
  { id: "es", label: "ES/ガクチカ" },
  { id: "interview-status", label: "選考状況" },
  { id: "contact", label: "連絡メモ" },
  { id: "next-action", label: "次回アクション" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

interface StudentTabsProps {
  student: Student;
  analysis: AIAnalysis | null;
  onStudentUpdate: (student: Student) => void;
  interviewRefreshKey?: number;
  onAnalysisSaved?: (analysis: AIAnalysis) => void;
}

export function StudentTabs({
  student,
  analysis,
  onStudentUpdate,
  interviewRefreshKey = 0,
  onAnalysisSaved,
}: StudentTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("basic");

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="z-10 shrink-0 border-b border-border bg-background/95 px-4 backdrop-blur-sm lg:px-6">
        <div className="flex gap-1 overflow-x-auto scroll-area scroll-x-smooth py-2.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "shrink-0 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-all duration-150",
                activeTab === tab.id
                  ? "bg-foreground text-background shadow-xs"
                  : "text-foreground-muted hover:bg-background-subtle hover:text-foreground-secondary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain scroll-area scroll-smooth">
        {activeTab === "basic" && (
          <BasicInfoTab student={student} onUpdate={onStudentUpdate} />
        )}
        {activeTab === "interviews" && (
          <InterviewHistoryTab
            student={student}
            refreshKey={interviewRefreshKey}
            onAnalysisSaved={onAnalysisSaved}
          />
        )}
        {activeTab === "ai" && (
          <>
            <div className="lg:hidden">
              <AnalysisPanel
                analysis={analysis}
                student={student}
                compact
              />
            </div>
            <div className="hidden p-8 lg:block">
              <p className="text-sm text-foreground-muted">
                右側のパネルに分析レポートが表示されています。
              </p>
            </div>
          </>
        )}
        {activeTab === "es" && (
          <EsTab student={student} onUpdate={onStudentUpdate} />
        )}
        {activeTab === "interview-status" && (
          <InterviewStatusTab student={student} />
        )}
        {activeTab === "contact" && (
          <ContactMemoTab student={student} onUpdate={onStudentUpdate} />
        )}
        {activeTab === "next-action" && (
          <NextActionTab student={student} onUpdate={onStudentUpdate} />
        )}
      </div>
    </div>
  );
}
