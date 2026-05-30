"use client";

import { use } from "react";
import { CAStudentDetailView } from "@/components/ca/CAStudentDetailView";

export default function CAStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <CAStudentDetailView studentId={id} />;
}
