"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TemperatureBadge } from "@/components/students/TemperatureBadge";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import { mockGenerateShareTexts } from "@/lib/companies/aggregates";
import type { CompanyDetail } from "@/lib/data/types";

export default function CompanyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [generated, setGenerated] = useState<ReturnType<
    typeof mockGenerateShareTexts
  > | null>(null);

  useEffect(() => {
    void fetchJson<CompanyDetail | null>(`/api/companies/${id}`, {
      fallback: () => clientMockFallback.company(id),
      allowNull: true,
    }).then((data) => {
      if (data) {
        setCompany(data);
        setGenerated(mockGenerateShareTexts(data));
      }
    });
  }, [id]);

  if (!company) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-foreground-muted">
        読み込み中...
      </div>
    );
  }

  return (
    <>
      <TopBar title={company.name} description={company.industry} />
      <div className="mx-auto max-w-5xl space-y-6 p-6 lg:p-8">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-foreground">基本情報</h3>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-foreground-muted">採用ターゲット</dt>
              <dd>{company.targetProfile}</dd>
            </div>
            <div>
              <dt className="text-foreground-muted">求める人物像</dt>
              <dd>{company.desiredPersonality}</dd>
            </div>
            <div>
              <dt className="text-foreground-muted">採用人数</dt>
              <dd>{company.hiringCount}名</dd>
            </div>
            <div>
              <dt className="text-foreground-muted">選考フロー</dt>
              <dd>{company.selectionFlow}</dd>
            </div>
            <div>
              <dt className="text-foreground-muted">説明会</dt>
              <dd>{company.briefingSchedule}</dd>
            </div>
            <div>
              <dt className="text-foreground-muted">関連CA</dt>
              <dd>{company.relatedCaNames.join("、")}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-sm font-semibold">選考中学生</h3>
          {company.students.length === 0 ? (
            <p className="text-sm text-foreground-muted">該当なし</p>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {company.students.map(({ student, stage }) => (
                <li
                  key={student.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div>
                    <Link
                      href={`/students/${student.id}`}
                      className="font-medium hover:text-accent"
                    >
                      {student.name}
                    </Link>
                    <p className="text-xs text-foreground-muted">
                      {student.assignedCaName} · {stage}
                    </p>
                    {student.nextAction && (
                      <p className="mt-1 text-xs text-foreground-secondary">
                        次: {student.nextAction}
                      </p>
                    )}
                  </div>
                  <TemperatureBadge temperature={student.temperature} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-sm font-semibold">企業ナレッジ</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-medium text-foreground-muted">
                面接でよく聞かれる質問
              </p>
              <ul className="mt-1 list-inside list-disc">
                {company.knowledge.interviewQuestions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-foreground-muted">
                通過しやすい学生タイプ
              </p>
              <p>{company.knowledge.passedStudentTraits.join("、")}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-foreground-muted">注意点</p>
              <ul className="mt-1 list-inside list-disc">
                {company.knowledge.cautionNotes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-foreground-muted">
                CA向け共有メモ
              </p>
              <p className="mt-1">{company.knowledge.caShareMemo}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">AI共有文生成（モック）</h3>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setGenerated(mockGenerateShareTexts(company))}
            >
              再生成
            </Button>
          </div>
          {generated && (
            <div className="space-y-4 text-sm">
              {[
                ["CA向け共有文", generated.caShare],
                ["学生向けLINE文", generated.studentLine],
                ["説明会案内文", generated.briefingInvite],
                ["面接前リマインド", generated.interviewReminder],
              ].map(([label, text]) => (
                <div key={label}>
                  <p className="text-xs font-medium text-foreground-muted">
                    {label}
                  </p>
                  <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-background-subtle p-3 text-xs">
                    {text}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
