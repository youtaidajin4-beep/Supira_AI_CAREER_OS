import temperatureHistorySeed from "@/data/seed/temperature-history.json";
import type { Student, Temperature, TemperatureSnapshot } from "@/lib/data/types";
import { scoreToTemperature, computeTemperatureScore } from "./score";

export function getTemperatureHistoryForStudent(
  student: Student,
  seedOverride?: TemperatureSnapshot[]
): TemperatureSnapshot[] {
  const seed = seedOverride ?? (temperatureHistorySeed as TemperatureSnapshot[]);
  const fromSeed = seed
    .filter((s) => s.studentId === student.id)
    .sort(
      (a, b) =>
        new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
    );

  if (fromSeed.length >= 2) return fromSeed;

  const now = new Date();
  const computed = scoreToTemperature(computeTemperatureScore(student));
  const fallback: TemperatureSnapshot[] = [
    {
      studentId: student.id,
      temperature: bumpUp(computed),
      recordedAt: new Date(
        now.getTime() - 21 * 86400000
      ).toISOString(),
    },
    {
      studentId: student.id,
      temperature: computed === "at_risk" ? "low" : computed,
      recordedAt: new Date(
        now.getTime() - 10 * 86400000
      ).toISOString(),
    },
    {
      studentId: student.id,
      temperature: student.temperature,
      recordedAt: now.toISOString(),
    },
  ];
  return fallback;
}

function bumpUp(t: Temperature): Temperature {
  if (t === "at_risk") return "low";
  if (t === "low") return "medium";
  if (t === "medium") return "high";
  return "high";
}
