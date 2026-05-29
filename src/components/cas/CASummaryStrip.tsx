import type { CAUser } from "@/lib/data/types";

export function CASummaryStrip({ cas }: { cas: CAUser[] }) {
  const needsSupport = cas.filter((c) => c.performanceStatus === "needs_support").length;
  const excellent = cas.filter((c) => c.performanceStatus === "excellent").length;
  const totalRisk = cas.reduce((s, c) => s + c.riskStudentCount, 0);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: "CA人数", value: cas.length },
        { label: "要支援", value: needsSupport, warn: needsSupport > 0 },
        { label: "好調", value: excellent },
        { label: "離脱リスク計", value: totalRisk, danger: totalRisk > 0 },
      ].map((item) => (
        <div
          key={item.label}
          className="executive-panel px-4 py-3 text-center"
        >
          <p
            className={`text-2xl font-semibold tabular-nums ${
              item.danger && item.value > 0
                ? "text-danger"
                : item.warn && item.value > 0
                  ? "text-warning"
                  : "text-foreground"
            }`}
          >
            {item.value}
          </p>
          <p className="mt-0.5 text-[11px] text-foreground-muted">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
