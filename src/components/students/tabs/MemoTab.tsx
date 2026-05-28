"use client";

import { useState } from "react";
import type { Student } from "@/lib/data/types";
import { Textarea } from "@/components/ui/input";
import { fetchJsonMutation } from "@/lib/api/fetch-json";
import { Button } from "@/components/ui/button";

interface MemoTabProps {
  student: Student;
  onUpdate: (student: Student) => void;
}

export function MemoTab({ student, onUpdate }: MemoTabProps) {
  const [memo, setMemo] = useState(student.memo);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const updated = await fetchJsonMutation<Student>(
      `/api/students/${student.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memo }),
      }
    );
    if (updated) onUpdate(updated);
    else onUpdate({ ...student, memo });
    setSaving(false);
  };

  return (
    <div className="mx-auto max-w-2xl p-6 lg:p-8">
      <div className="mb-5">
        <h4 className="text-sm font-semibold text-foreground">CAメモ</h4>
        <p className="mt-0.5 text-xs text-foreground-muted">
          面談の気づきや次回の準備メモ
        </p>
      </div>
      <Textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        rows={14}
        placeholder="自由にメモを記入..."
        className="min-h-[280px]"
      />
      <div className="mt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : "保存"}
        </Button>
      </div>
    </div>
  );
}
