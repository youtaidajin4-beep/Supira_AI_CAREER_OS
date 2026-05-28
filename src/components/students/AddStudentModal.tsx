"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CAUser, Student, StudentStatus, Temperature } from "@/lib/data/types";
import { STATUS_LABELS, TEMPERATURE_LABELS } from "@/lib/data/types";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson, fetchJsonMutation } from "@/lib/api/fetch-json";
import { cn } from "@/lib/utils/cn";

interface AddStudentModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function AddStudentModal({
  open,
  onClose,
  onCreated,
}: AddStudentModalProps) {
  const router = useRouter();
  const [cas, setCas] = useState<CAUser[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    university: "",
    grade: "3年",
    assignedCaId: "",
    industry: "",
    targetCompanies: "",
    status: "before_interview" as StudentStatus,
    temperature: "medium" as Temperature,
    memo: "",
  });

  useEffect(() => {
    if (open) {
      void fetchJson<CAUser[]>("/api/cas", {
        fallback: () => clientMockFallback.cas(),
      }).then((list) => {
        setCas(list);
        if (list[0] && !form.assignedCaId) {
          setForm((f) => ({ ...f, assignedCaId: list[0].id }));
        }
      });
    }
  }, [open, form.assignedCaId]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const student = await fetchJsonMutation<Student>("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        targetCompanies: form.targetCompanies,
      }),
    });
    setSaving(false);
    if (student?.id) {
      onCreated?.();
      onClose();
      router.push(`/students/${student.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
        aria-label="閉じる"
      />
      <div
        className={cn(
          "relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-lg scroll-area"
        )}
      >
        <h2 className="text-lg font-semibold text-foreground">学生を追加</h2>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <Input
            label="氏名"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="大学"
              required
              value={form.university}
              onChange={(e) => setForm({ ...form, university: e.target.value })}
            />
            <Input
              label="学年"
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
            />
          </div>
          <Select
            label="担当CA"
            value={form.assignedCaId}
            onChange={(e) =>
              setForm({ ...form, assignedCaId: e.target.value })
            }
          >
            {cas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Input
            label="志望業界"
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
          />
          <Input
            label="志望企業"
            hint="カンマ区切り"
            value={form.targetCompanies}
            onChange={(e) =>
              setForm({ ...form, targetCompanies: e.target.value })
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="ステータス"
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as StudentStatus,
                })
              }
            >
              {(Object.keys(STATUS_LABELS) as StudentStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </Select>
            <Select
              label="温度感"
              value={form.temperature}
              onChange={(e) =>
                setForm({
                  ...form,
                  temperature: e.target.value as Temperature,
                })
              }
            >
              {(Object.keys(TEMPERATURE_LABELS) as Temperature[]).map((t) => (
                <option key={t} value={t}>
                  {TEMPERATURE_LABELS[t]}
                </option>
              ))}
            </Select>
          </div>
          <Textarea
            label="初回メモ"
            value={form.memo}
            onChange={(e) => setForm({ ...form, memo: e.target.value })}
            rows={3}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "登録中..." : "登録する"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
