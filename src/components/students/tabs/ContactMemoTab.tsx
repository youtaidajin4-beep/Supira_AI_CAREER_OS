"use client";

import { useState } from "react";
import type { Student } from "@/lib/data/types";
import { Textarea } from "@/components/ui/input";
import { fetchJsonMutation } from "@/lib/api/fetch-json";
import { Button } from "@/components/ui/button";

interface ContactMemoTabProps {
  student: Student;
  onUpdate: (student: Student) => void;
}

export function ContactMemoTab({ student, onUpdate }: ContactMemoTabProps) {
  const [contactMemo, setContactMemo] = useState(student.contactMemo);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const updated = await fetchJsonMutation<Student>(
      `/api/students/${student.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactMemo }),
      }
    );
    if (updated) onUpdate(updated);
    else onUpdate({ ...student, contactMemo });
    setSaving(false);
  };

  return (
    <div className="mx-auto max-w-2xl p-6 lg:p-8">
      <div className="mb-5">
        <h4 className="text-sm font-semibold text-foreground">連絡メモ</h4>
        <p className="mt-0.5 text-xs text-foreground-muted">
          LINE・メールなどのやり取り記録
        </p>
      </div>
      <Textarea
        value={contactMemo}
        onChange={(e) => setContactMemo(e.target.value)}
        rows={14}
        placeholder="連絡内容を記録..."
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
