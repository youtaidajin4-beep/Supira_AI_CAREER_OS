"use client";

import { useState } from "react";
import type { Student } from "@/lib/data/types";
import { Input, Textarea } from "@/components/ui/input";
import { fetchJsonMutation } from "@/lib/api/fetch-json";
import { Button } from "@/components/ui/button";

interface NextActionTabProps {
  student: Student;
  onUpdate: (student: Student) => void;
}

export function NextActionTab({ student, onUpdate }: NextActionTabProps) {
  const [nextAction, setNextAction] = useState(student.nextAction);
  const [nextActionDue, setNextActionDue] = useState(
    student.nextActionDue ? student.nextActionDue.slice(0, 10) : ""
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      nextAction,
      nextActionDue: nextActionDue
        ? new Date(nextActionDue).toISOString()
        : "",
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

  return (
    <div className="mx-auto max-w-2xl space-y-5 p-6 lg:p-8">
      <div>
        <h4 className="text-sm font-semibold text-foreground">次回アクション</h4>
        <p className="mt-0.5 text-xs text-foreground-muted">
          CAが次に取るべきフォロー内容
        </p>
      </div>
      <Textarea
        label="アクション内容"
        value={nextAction}
        onChange={(e) => setNextAction(e.target.value)}
        rows={4}
      />
      <Input
        label="期限"
        type="date"
        value={nextActionDue}
        onChange={(e) => setNextActionDue(e.target.value)}
      />
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "保存中..." : "保存"}
      </Button>
    </div>
  );
}
