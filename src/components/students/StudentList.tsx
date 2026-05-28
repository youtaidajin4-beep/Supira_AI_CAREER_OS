"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import type { Student } from "@/lib/data/types";
import { STATUS_LABELS } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";
import { TemperatureBadge } from "./TemperatureBadge";
import { FollowIndicator } from "@/components/shared/FollowIndicator";
import { StudentListFilters } from "./StudentListFilters";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { ListItemSkeleton } from "@/components/ui/skeleton";

interface StudentListProps {
  selectedId?: string;
}

export function StudentList({ selectedId }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (university) params.set("university", university);
    if (status) params.set("status", status);

    const data = await fetchJson<Student[]>(`/api/students?${params}`, {
      fallback: () => clientMockFallback.students(),
    });
    setStudents(data);
    setLoading(false);
  }, [name, university, status]);

  useEffect(() => {
    const timer = setTimeout(fetchStudents, 200);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <div className="border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            学生一覧
          </h3>
          <span className="rounded-full bg-background-subtle px-2 py-0.5 text-[11px] font-medium tabular-nums text-foreground-muted">
            {loading ? "—" : `${students.length}名`}
          </span>
        </div>
      </div>

      <StudentListFilters
        name={name}
        university={university}
        status={status}
        onNameChange={setName}
        onUniversityChange={setUniversity}
        onStatusChange={setStatus}
      />

      <div className="flex-1 overflow-y-auto scroll-area">
        {loading ? (
          <div>
            {Array.from({ length: 6 }).map((_, i) => (
              <ListItemSkeleton key={i} />
            ))}
          </div>
        ) : students.length === 0 ? (
          <EmptyState
            icon={Users}
            title="該当する学生がいません"
            description="検索条件を変更してください"
          />
        ) : (
          <ul>
            {students.map((student) => {
              const selected = selectedId === student.id;
              return (
                <li key={student.id}>
                  <Link
                    href={`/students/${student.id}`}
                    className={cn(
                      "group relative flex gap-3 border-b border-border-subtle px-4 py-3 transition-all duration-150",
                      selected
                        ? "bg-accent-subtle/70"
                        : "hover:bg-background-subtle/80"
                    )}
                  >
                    {selected && (
                      <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-accent" />
                    )}
                    <Avatar name={student.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "truncate text-sm font-medium",
                            selected ? "text-accent" : "text-foreground"
                          )}
                        >
                          {student.name}
                        </p>
                        <TemperatureBadge
                          temperature={student.temperature}
                          showDot={false}
                          className="shrink-0 scale-90"
                        />
                      </div>
                      <p className="mt-0.5 truncate text-xs text-foreground-muted">
                        {student.university}
                      </p>
                      <p className="mt-1 text-[11px] text-foreground-muted/80">
                        {STATUS_LABELS[student.status]}
                      </p>
                      <FollowIndicator student={student} className="mt-1" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
