"use client";

import { useState } from "react";
import type { Student } from "@/lib/data/types";
import { Textarea } from "@/components/ui/input";
import { fetchJsonMutation } from "@/lib/api/fetch-json";
import { Button } from "@/components/ui/button";

interface EsTabProps {
  student: Student;
  onUpdate: (student: Student) => void;
}

export function EsTab({ student, onUpdate }: EsTabProps) {
  const [esMemo, setEsMemo] = useState(student.esMemo);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const updated = await fetchJsonMutation<Student>(
      `/api/students/${student.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ esMemo }),
      }
    );
    if (updated) onUpdate(updated);
    else onUpdate({ ...student, esMemo });
    setSaving(false);
  };

  return (
    <div className="mx-auto max-w-2xl p-6 lg:p-8">
      <div className="mb-5 rounded-lg border border-border-subtle bg-background-subtle/50 px-4 py-3">
        <p className="text-xs leading-relaxed text-foreground-muted">
          ES・ガクチカの自動生成は今後対応予定です。骨子や要点をメモとして残せます。
        </p>
      </div>
      <Textarea
        label="ES / ガクチカメモ"
        value={esMemo}
        onChange={(e) => setEsMemo(e.target.value)}
        rows={12}
        placeholder="ESの要点、ガクチカのストーリー骨子など..."
        className="min-h-[240px]"
      />
      <div className="mt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : "保存"}
        </Button>
      </div>
    </div>
  );
}
