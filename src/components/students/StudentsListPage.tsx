"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { StudentListFilters } from "@/components/students/StudentListFilters";
import { AddStudentModal } from "@/components/students/AddStudentModal";
import { TemperatureBadge } from "@/components/students/TemperatureBadge";
import { FollowIndicator } from "@/components/shared/FollowIndicator";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import type { Student, StudentStatus } from "@/lib/data/types";
import { STATUS_LABELS } from "@/lib/data/types";

export function StudentsListPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [filters, setFilters] = useState<{
    name: string;
    university: string;
    status: StudentStatus | "";
  }>({ name: "", university: "", status: "" });

  const load = async () => {
    const params = new URLSearchParams();
    if (filters.name) params.set("name", filters.name);
    if (filters.university) params.set("university", filters.university);
    if (filters.status) params.set("status", filters.status);
    const list = await fetchJson<Student[]>(`/api/students?${params}`, {
      fallback: () => clientMockFallback.students(),
    });
    setStudents(list);
  };

  useEffect(() => {
    load();
  }, [filters]);

  const sorted = useMemo(
    () =>
      [...students].sort((a, b) => {
        if (a.temperature === "at_risk" && b.temperature !== "at_risk")
          return -1;
        if (b.temperature === "at_risk" && a.temperature !== "at_risk")
          return 1;
        return b.unreadDays - a.unreadDays;
      }),
    [students]
  );

  return (
    <>
      <TopBar
        title="学生一覧"
        description={`${students.length}名`}
        actions={
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className={buttonClass("primary", "md")}
          >
            <Plus className="h-4 w-4" />
            学生を追加
          </button>
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto scroll-area scroll-smooth p-6">
        <StudentListFilters
          name={filters.name}
          university={filters.university}
          status={filters.status}
          onNameChange={(name) => setFilters((f) => ({ ...f, name }))}
          onUniversityChange={(university) =>
            setFilters((f) => ({ ...f, university }))
          }
          onStatusChange={(status) =>
            setFilters((f) => ({
              ...f,
              status: status as StudentStatus | "",
            }))
          }
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((student) => (
            <Link key={student.id} href={`/students/${student.id}`}>
              <Card className="p-4 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{student.name}</p>
                    <p className="text-xs text-foreground-muted">
                      {student.university} · {student.assignedCaName}
                    </p>
                  </div>
                  <TemperatureBadge temperature={student.temperature} />
                </div>
                <p className="mt-2 text-xs text-foreground-secondary">
                  {STATUS_LABELS[student.status]}
                </p>
                <FollowIndicator student={student} className="mt-2" />
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <AddStudentModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={load}
      />
    </>
  );
}
