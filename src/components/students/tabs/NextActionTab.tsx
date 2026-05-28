"use client";

import { useState } from "react";
import type { Student } from "@/lib/data/types";
import { Input, Textarea } from "@/components/ui/input";
import { fetchJsonMutation } from "@/lib/api/fetch-json";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface NextActionTabProps {
  student: Student;
  onUpdate: (student: Student) => void;
}

export function NextActionTab({ student, onUpdate }: NextActionTabProps) {
  const [nextAction, setNextAction] = useState(student.nextAction);
  const [nextActionDue, setNextActionDue] = useState(
    student.nextActionDue ? student.nextActionDue.slice(0, 10) : ""
  );
  const [assignee, setAssignee] = useState<"ca" | "executive">(
    student.nextActionAssignee ?? "ca"
  );
  const [status, setStatus] = useState<"pending" | "done">(
    student.nextActionStatus ?? "pending"
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      nextAction,
      nextActionDue: nextActionDue
        ? new Date(nextActionDue).toISOString()
        : "",
      nextActionAssignee: assignee,
      nextActionStatus: status,
    };
    const updated = await fetchJsonMutation<Student>(
      `/api/students/${student.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (updated) onUpdate(updated);
    else onUpdate({ ...student, ...payload });
    setSaving(false);
  };

  const unset = !nextAction?.trim();

  return (
    <div className="mx-auto max-w-2xl space-y-5 p-6 lg:p-8">
      {unset && (
        <div className="rounded-lg border border-l-[3px] border-l-warning border-border bg-warning-subtle/30 px-4 py-3 text-sm text-foreground-secondary">
          次回アクションが未設定です。カルテ上部にも警告が表示されます。
        </div>
      )}
      <div>
        <h4 className="text-sm font-semibold text-foreground">次回アクション</h4>
        <p className="mt-0.5 text-xs text-foreground-muted">
          担当・期限・状態を管理します
        </p>
      </div>
      <Textarea
        label="アクション内容"
        value={nextAction}
        onChange={(e) => setNextAction(e.target.value)}
        rows={4}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-foreground-secondary">
            担当
          </label>
          <select
            value={assignee}
            onChange={(e) =>
              setAssignee(e.target.value as "ca" | "executive")
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="ca">CA</option>
            <option value="executive">代表（福与さん）</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-foreground-secondary">
            状態
          </label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "pending" | "done")
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="pending">未着手</option>
            <option value="done">完了</option>
          </select>
        </div>
      </div>
      <Input
        label="期限"
        type="date"
        value={nextActionDue}
        onChange={(e) => setNextActionDue(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium",
            status === "done"
              ? "bg-success-subtle text-success"
              : "bg-background-subtle text-foreground-muted"
          )}
        >
          {status === "done" ? "完了" : "未着手"}
        </span>
        <span className="text-xs text-foreground-muted">
          担当: {assignee === "executive" ? "代表" : "CA"}
        </span>
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "保存中..." : "保存"}
      </Button>
    </div>
  );
}
