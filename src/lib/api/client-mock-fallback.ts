import studentsSeed from "@/data/seed/students.json";
import caUsersSeed from "@/data/seed/ca-users.json";
import companyUpdatesSeed from "@/data/seed/company-updates.json";
import alertsSeed from "@/data/seed/alerts.json";
import aiAnalysisSeed from "@/data/seed/ai-analysis.json";
import interviewsSeed from "@/data/seed/interviews.json";
import { getMockRepository } from "@/lib/data/mock-repository";
import { buildCAPerformanceMetrics, classifyCARiskStudents } from "@/lib/cas/performance";
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
        const enriched = {
          ...ca,
          studentCount: students.length,
          riskStudentCount: students.filter((s) => s.temperature === "at_risk")
            .length,
        };
        const performance = buildCAPerformanceMetrics(
          enriched,
          students,
          interviewsSeed as Interview[]
        );
        const { critical, attention } = classifyCARiskStudents(students);
        return {
          ca: enriched,
          students,
          atRiskStudents: students.filter((s) => s.temperature === "at_risk"),
          actionStudents: students.slice(0, 5),
          supportSuggestions: [performance.aiComment],
          performance,
          riskStudentsCritical: critical,
          riskStudentsAttention: attention,
        };
      }),

  companyUpdates: (): Promise<CompanyUpdate[]> =>
    mockRepo()
      .listCompanyUpdates()
      .catch(() => clone(companyUpdatesSeed as CompanyUpdate[])),

  alerts: (): Promise<Alert[]> =>
    mockRepo().listAlerts().catch(() => clone(alertsSeed as Alert[])),

  executiveDashboard: (): Promise<ExecutiveDashboardStats> =>
    mockRepo().getExecutiveDashboard(),

  studentTimeline: (studentId: string) =>
    mockRepo().getStudentTimeline(studentId),

  temperatureHistory: (studentId: string) =>
    mockRepo().getTemperatureHistory(studentId),

  activityLogs: () => mockRepo().listActivityLogs(),

  companies: () => mockRepo().listCompanies(),

  company: (id: string) => mockRepo().getCompany(id),

  knowledge: (category?: string) => mockRepo().listKnowledge(category),

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
