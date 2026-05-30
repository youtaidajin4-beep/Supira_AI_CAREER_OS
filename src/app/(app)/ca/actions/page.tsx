"use client";

import { useEffect, useState } from "react";
import { CAActionsList } from "@/components/ca/CAActionsList";
import { CAPageFrame } from "@/components/ca/CAPageFrame";
import { useAuth } from "@/lib/auth/auth-context";
import { fetchJson } from "@/lib/api/fetch-json";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import type { Student } from "@/lib/data/types";

export default function CAActionsPage() {
  const { session } = useAuth();
  const caId = session?.caId ?? "";
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (!caId) return;
    void fetchJson<Student[]>(`/api/students?caId=${caId}`, {
      fallback: async () => {
        const all = await clientMockFallback.students();
        return all.filter((s) => s.assignedCaId === caId);
      },
    }).then(setStudents);
  }, [caId]);

  return (
    <CAPageFrame
      title="次回アクション"
      description="学生ごとのフォロー項目と期限"
    >
      <div className="p-5 pb-10 lg:p-6 lg:pb-12">
        <CAActionsList students={students} />
      </div>
    </CAPageFrame>
  );
}
