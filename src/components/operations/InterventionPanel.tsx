import Link from "next/link";
import type { ExecutiveIntervention } from "@/lib/data/types";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { cn } from "@/lib/utils/cn";

export function InterventionPanel({
  interventions,
}: {
  interventions: ExecutiveIntervention[];
}) {
  const list = interventions.slice(0, 4);

  return (
    <DashboardSection title="代表介入" badge={interventions.length}>
      {list.length === 0 ? (
        <p className="text-sm text-foreground-muted">候補なし</p>
      ) : (
        <ul className="space-y-2">
          {list.map((item) => (
            <li key={item.id}>
              <Link
                href={
                  item.targetType === "ca"
                    ? `/cas/${item.targetId}`
                    : item.relatedStudentId
                      ? `/students/${item.relatedStudentId}`
                      : "/company-updates"
                }
                className={cn(
                  "block rounded-md px-2 py-1.5 text-sm hover:bg-background-subtle",
                  item.severity === "critical" && "border-l-2 border-l-danger/80 pl-2"
                )}
              >
                <span className="font-medium text-foreground">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardSection>
  );
}
