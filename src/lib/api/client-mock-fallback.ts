import studentsSeed from "@/data/seed/students.json";
import caUsersSeed from "@/data/seed/ca-users.json";
import companyUpdatesSeed from "@/data/seed/company-updates.json";
import alertsSeed from "@/data/seed/alerts.json";
import aiAnalysisSeed from "@/data/seed/ai-analysis.json";
import interviewsSeed from "@/data/seed/interviews.json";
import { getMockRepository } from "@/lib/data/mock-repository";
import type {
  AIAnalysis,
  Alert,
  CAUser,
  CADashboardStats,
  CompanyUpdate,
  ExecutiveDashboardStats,
  Interview,
  Student,
} from "@/lib/data/types";

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

const mockRepo = () => getMockRepository();

export const clientMockFallback = {
  students: (): Promise<Student[]> =>
    mockRepo().listStudents().catch(() => clone(studentsSeed as Student[])),

  student: (id: string): Promise<Student | null> =>
    mockRepo()
      .getStudent(id)
      .catch(
        () =>
          (studentsSeed as Student[]).find((s) => s.id === id) ?? null
      ),

  cas: (): Promise<CAUser[]> =>
    mockRepo().listCAs().catch(() => clone(caUsersSeed as CAUser[])),

  caDashboard: (id: string): Promise<CADashboardStats | null> =>
    mockRepo()
      .getCADashboard(id)
      .catch(async () => {
        const ca = clone(caUsersSeed as CAUser[]).find((c) => c.id === id);
        if (!ca) return null;
        const students = clone(studentsSeed as Student[]).filter(
          (s) => s.assignedCaId === id
        );
        return {
          ca: {
            ...ca,
            studentCount: students.length,
            riskStudentCount: students.filter((s) => s.temperature === "at_risk")
              .length,
          },
          students,
          atRiskStudents: students.filter((s) => s.temperature === "at_risk"),
          actionStudents: students.slice(0, 5),
          supportSuggestions: [
            "担当学生の温度感と次回アクションを確認してください（モック表示）",
          ],
        };
      }),

  companyUpdates: (): Promise<CompanyUpdate[]> =>
    mockRepo()
      .listCompanyUpdates()
      .catch(() => clone(companyUpdatesSeed as CompanyUpdate[])),

  alerts: (): Promise<Alert[]> =>
    mockRepo().listAlerts().catch(() => clone(alertsSeed as Alert[])),

  executiveDashboard: (): Promise<ExecutiveDashboardStats> =>
    mockRepo().getExecutiveDashboard().catch(async () => {
      const repo = mockRepo();
      return {
        totalStudents: (studentsSeed as Student[]).length,
        totalCAs: (caUsersSeed as CAUser[]).length,
        atRiskCount: 0,
        weeklyInterviews: 0,
        unresponsiveCount: 0,
        selectingCount: 0,
        offerCount: 0,
        criticalAlerts: [],
        priorityStudents: [],
        caSummaries: await repo.listCAs().catch(() =>
          clone(caUsersSeed as CAUser[])
        ),
        pendingCompanyUpdates: (companyUpdatesSeed as CompanyUpdate[]).filter(
          (u) => u.shareStatus === "unshared"
        ),
      };
    }),

  interviews: (studentId: string): Promise<Interview[]> =>
    mockRepo()
      .listInterviews(studentId)
      .catch(() =>
        (interviewsSeed as Interview[]).filter((i) => i.studentId === studentId)
      ),

  analysis: (studentId: string): Promise<AIAnalysis | null> =>
    mockRepo()
      .getLatestAnalysis(studentId)
      .catch(() => {
        const list = aiAnalysisSeed as AIAnalysis[];
        const match = list
          .filter((a) => a.studentId === studentId)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          );
        return match[0] ?? null;
      }),
};
