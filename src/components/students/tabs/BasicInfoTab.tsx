"use client";

import { useEffect, useState } from "react";
import type { CAUser, Student, Temperature, StudentStatus } from "@/lib/data/types";
import {
  TEMPERATURE_LABELS,
  STATUS_LABELS,
} from "@/lib/data/types";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson, fetchJsonMutation } from "@/lib/api/fetch-json";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BasicInfoTabProps {
  student: Student;
  onUpdate: (student: Student) => void;
}

export function BasicInfoTab({ student, onUpdate }: BasicInfoTabProps) {
  const [form, setForm] = useState(student);
  const [cas, setCas] = useState<CAUser[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void fetchJson<CAUser[]>("/api/cas", {
      fallback: () => clientMockFallback.cas(),
    }).then(setCas);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const updated = await fetchJsonMutation<Student>(
      `/api/students/${student.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );
    if (updated) {
      onUpdate(updated);
      setMessage("保存しました");
      setTimeout(() => setMessage(""), 3000);
    } else {
      onUpdate({ ...form, updatedAt: new Date().toISOString() });
      setMessage("保存しました（オフライン）");
      setTimeout(() => setMessage(""), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-5 lg:px-6 lg:py-6">
      <div>
        <h4 className="text-sm font-semibold text-foreground">基本情報</h4>
        <p className="mt-0.5 text-xs text-foreground-muted">
          学生のプロフィールと選考ステータス
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="名前"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="大学"
          value={form.university}
          onChange={(e) => setForm({ ...form, university: e.target.value })}
        />
        <Input
          label="学年"
          value={form.grade}
          onChange={(e) => setForm({ ...form, grade: e.target.value })}
        />
        <Input
          label="志望業界"
          value={form.industry}
          onChange={(e) => setForm({ ...form, industry: e.target.value })}
        />
        <Select
          label="担当CA"
          value={form.assignedCaId}
          onChange={(e) => {
            const ca = cas.find((c) => c.id === e.target.value);
            setForm({
              ...form,
              assignedCaId: e.target.value,
              assignedCaName: ca?.name ?? form.assignedCaName,
              assignedCA: ca?.name ?? form.assignedCA,
            });
          }}
        >
          {cas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select
          label="温度感"
          value={form.temperature}
          onChange={(e) =>
            setForm({ ...form, temperature: e.target.value as Temperature })
          }
        >
          {(Object.keys(TEMPERATURE_LABELS) as Temperature[]).map((t) => (
            <option key={t} value={t}>
              {TEMPERATURE_LABELS[t]}
            </option>
          ))}
        </Select>
        <div className="sm:col-span-2">
        <Select
          label="ステータス"
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value as StudentStatus })
          }
        >
          {(Object.keys(STATUS_LABELS) as StudentStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
        </div>
      </div>

      <div className="sm:col-span-2">
        <Textarea
          label="初回メモ（CAメモ）"
          value={form.memo}
          onChange={(e) => setForm({ ...form, memo: e.target.value })}
          rows={4}
        />
      </div>

      <Input
        label="志望企業"
        hint="カンマ区切りで入力"
        value={form.targetCompanies.join(", ")}
        onChange={(e) =>
          setForm({
            ...form,
            targetCompanies: e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          })
        }
      />

      <div className="flex items-center gap-3 border-t border-border-subtle pt-5">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : "変更を保存"}
        </Button>
        {message && (
          <span
            className={`text-sm ${
              message.includes("失敗")
                ? "text-danger"
                : "text-success"
            }`}
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
