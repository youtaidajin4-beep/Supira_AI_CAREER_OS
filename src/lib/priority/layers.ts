import { daysSince } from "@/lib/follow/alerts";
import type {
  ActivityLog,
  ActivityLogSeverity,
  Alert,
  LayeredAlerts,
  LayeredItem,
  PriorityLayer,
  Student,
} from "@/lib/data/types";

export function classifyStudentLayer(student: Student): PriorityLayer {
  if (
    student.temperature === "at_risk" ||
    student.interviewDeclined ||
    (student.status === "selecting" && student.unreadDays >= 7)
  ) {
    return "critical";
  }
  if (
    student.temperature === "low" ||
    student.unreadDays >= 5 ||
    !student.nextAction?.trim() ||
    daysSince(student.lastMemoUpdatedAt) >= 7
  ) {
    return "attention";
  }
  return "info";
}

export function activitySeverityToLayer(
  severity: ActivityLogSeverity
): PriorityLayer {
  if (severity === "critical") return "critical";
  if (severity === "attention") return "attention";
  return "info";
}

export function alertToLayer(alert: Alert): PriorityLayer {
  if (alert.severity === "critical") return "critical";
  if (alert.severity === "warning") return "attention";
  return "info";
}

export function buildLayeredAlerts(
  alerts: Alert[],
  students: Student[],
  activities: ActivityLog[]
): LayeredAlerts {
  const items: LayeredItem[] = [];

  for (const alert of alerts.filter((a) => !a.resolved)) {
    items.push({
      id: `alert-${alert.id}`,
      layer: alertToLayer(alert),
      title: alert.title,
      description: alert.description,
      relatedStudentId: alert.relatedStudentId,
      relatedCaId: alert.relatedCaId,
      createdAt: alert.createdAt,
    });
  }

  for (const student of students) {
    const layer = classifyStudentLayer(student);
    if (layer === "info") continue;
    items.push({
      id: `stu-layer-${student.id}`,
      layer,
      title: `${student.name}さん`,
      description:
        layer === "critical"
          ? "離脱リスクまたは選考中の未接触"
          : "温度感低下・フォロー遅延の可能性",
      relatedStudentId: student.id,
      relatedStudentName: student.name,
      relatedCaId: student.assignedCaId,
      relatedCaName: student.assignedCaName,
      createdAt: student.updatedAt,
    });
  }

  for (const log of activities.slice(0, 12)) {
    if (log.severity === "info" && log.type !== "company_update") continue;
    items.push({
      id: `act-${log.id}`,
      layer: activitySeverityToLayer(log.severity),
      title: log.title,
      description: log.description,
      relatedStudentId: log.relatedStudentId,
      relatedStudentName: log.relatedStudentName,
      relatedCaId: log.relatedCaId,
      relatedCaName: log.relatedCaName,
      relatedCompanyId: log.relatedCompanyId,
      relatedCompanyName: log.relatedCompanyName,
      createdAt: log.createdAt,
    });
  }

  const deduped = dedupeLayered(items);
  return {
    critical: deduped.filter((i) => i.layer === "critical").slice(0, 8),
    attention: deduped.filter((i) => i.layer === "attention").slice(0, 10),
    info: deduped.filter((i) => i.layer === "info").slice(0, 8),
  };
}

function dedupeLayered(items: LayeredItem[]): LayeredItem[] {
  const seen = new Set<string>();
  return items
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .filter((item) => {
      const key = `${item.layer}-${item.relatedStudentId ?? item.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}
