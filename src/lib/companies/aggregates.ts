import type {
  CAUser,
  Company,
  CompanyDetail,
  CompanyListItem,
  CompanyShareSummary,
  CompanyStudentRow,
  CompanyUpdate,
  Student,
} from "@/lib/data/types";
import { pendingCompanyUpdates } from "@/lib/data/aggregates";
import { isDateToday } from "@/lib/utils/dates";

export function buildCompanyListItems(
  companies: Company[],
  students: Student[],
  cas: CAUser[],
  updates: CompanyUpdate[]
): CompanyListItem[] {
  const caMap = new Map(cas.map((c) => [c.id, c.name]));

  return companies.map((company) => {
    const active = students.filter((s) =>
      company.activeStudentIds.includes(s.id)
    );
    const selecting = active.filter((s) => s.status === "selecting");
    const urgent = updates.filter(
      (u) =>
        u.companyName === company.name &&
        u.shareStatus === "unshared" &&
        u.priority === "high"
    );

    return {
      ...company,
      selectingStudentCount: selecting.length,
      urgentContactCount: urgent.length,
      relatedCaNames: company.relatedCaIds
        .map((id) => caMap.get(id))
        .filter(Boolean) as string[],
    };
  });
}

export function buildCompanyDetail(
  company: Company,
  students: Student[],
  cas: CAUser[],
  updates: CompanyUpdate[]
): CompanyDetail {
  const caMap = new Map(cas.map((c) => [c.id, c.name]));
  const active = students.filter((s) =>
    company.activeStudentIds.includes(s.id)
  );

  const rows: CompanyStudentRow[] = active.map((student) => {
    const match = student.interviewStatus.find((i) =>
      i.company.includes(company.name.slice(0, 4))
    );
    return {
      student,
      stage: match?.stage ?? "選考準備中",
    };
  });

  return {
    ...company,
    relatedCaNames: company.relatedCaIds
      .map((id) => caMap.get(id))
      .filter(Boolean) as string[],
    students: rows,
    urgentUpdates: updates.filter((u) => u.companyName === company.name),
  };
}

export function buildCompanyShareSummary(
  companies: Company[],
  students: Student[],
  updates: CompanyUpdate[]
): CompanyShareSummary {
  const pending = pendingCompanyUpdates(updates);
  const todayShare = updates.filter(
    (u) =>
      isDateToday(u.createdAt) ||
      (u.shareStatus === "unshared" && u.priority === "high")
  );

  const hotCompanies = companies
    .map((c) => ({
      companyId: c.id,
      companyName: c.name,
      studentCount: students.filter((s) =>
        c.activeStudentIds.includes(s.id)
      ).length,
    }))
    .filter((c) => c.studentCount > 0)
    .sort((a, b) => b.studentCount - a.studentCount)
    .slice(0, 5);

  return {
    unsharedCount: pending.length,
    todayShareCount: todayShare.length,
    hotCompanies,
  };
}

export function mockGenerateShareTexts(company: Company) {
  return {
    caShare: `【${company.name}】\n採用ターゲット: ${company.targetProfile}\n求める人物像: ${company.desiredPersonality}\n${company.knowledge.caShareMemo}`,
    studentLine: `【${company.name}】\n説明会: ${company.briefingSchedule}\n選考フロー: ${company.selectionFlow}\nご不明点は担当CAまでご連絡ください。`,
    briefingInvite: `${company.name}の説明会のご案内です。\n日程: ${company.briefingSchedule}\n対象: ${company.targetProfile}`,
    interviewReminder: `${company.name}の面接前リマインドです。\nよく聞かれる質問: ${company.knowledge.interviewQuestions.slice(0, 2).join(" / ")}`,
  };
}
