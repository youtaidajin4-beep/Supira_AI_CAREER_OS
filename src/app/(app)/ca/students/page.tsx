"use client";

import { useEffect, useState } from "react";
import { CAStudentTable } from "@/components/ca/CAStudentTable";
import { CAPageFrame } from "@/components/ca/CAPageFrame";
import { useAuth } from "@/lib/auth/auth-context";
import { fetchJson } from "@/lib/api/fetch-json";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import type { Student } from "@/lib/data/types";

export default function CAStudentsPage() {
  const { session } = useAuth();
  const caId = session?.caId ?? "";
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (!caId) return;
    const url = `/api/students?caId=${caId}`;
    void fetchJson<Student[]>(url, {
      fallback: async () => {
        const all = await clientMockFallback.students();
        return all.filter((s) => s.assignedCaId === caId);
      },
    }).then(setStudents);
  }, [caId]);

  return (
    <CAPageFrame
      title="担当学生"
      description="あなたが担当する学生のみ表示されます"
    >
      <div className="p-5 pb-10 lg:p-6 lg:pb-12">
        <CAStudentTable students={students} />
      </div>
    </CAPageFrame>
  );
}
