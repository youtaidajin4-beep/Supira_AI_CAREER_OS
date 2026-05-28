import studentsSeed from "@/data/seed/students.json";
import interviewsSeed from "@/data/seed/interviews.json";
import aiAnalysisSeed from "@/data/seed/ai-analysis.json";
import notificationsSeed from "@/data/seed/notifications.json";
import caUsersSeed from "@/data/seed/ca-users.json";
import companyUpdatesSeed from "@/data/seed/company-updates.json";
import alertsSeed from "@/data/seed/alerts.json";
import companiesSeed from "@/data/seed/companies.json";
import knowledgeItemsSeed from "@/data/seed/knowledge-items.json";
import {
  buildCAAttentionSummaries,
  buildPriorityCards,
  buildPriorityStudents,
  countOffers,
  countSelecting,
  countUnresponsive,
  enrichCAStats,
  pendingCompanyUpdates,
} from "@/lib/data/aggregates";
import { mergeAlerts } from "@/lib/follow/alerts";
import { mergeActivityLogs, getTodayActivityFeed } from "@/lib/activity/build-logs";
import {
  buildCAOperationsSummary,
  buildCAPerformanceMetrics,
  classifyCARiskStudents,
  enrichCAWithPerformance,
} from "@/lib/cas/performance";
import {
  buildCompanyDetail,
  buildCompanyListItems,
  buildCompanyShareSummary,
} from "@/lib/companies/aggregates";
import { pickKnowledgeCandidates } from "@/lib/knowledge/candidates";
import { buildExecutiveInterventions } from "@/lib/operations/interventions";
import { buildOperationInsights } from "@/lib/operations/insights";
import { buildLayeredAlerts } from "@/lib/priority/layers";
import { buildStudentTimeline } from "@/lib/timeline/build-events";
import { getTemperatureHistoryForStudent } from "@/lib/temperature/history";
import { isDateToday } from "@/lib/utils/dates";
import type { AlertFilters, DataRepository } from "./repository";
import type {
  ActivityLog,
  AIAnalysis,
  Alert,
  CAUser,
  CADashboardStats,
  Company,
  CompanyDetail,
  CompanyListItem,
  CompanyUpdate,
  KnowledgeItem,
  CreateAnalysisInput,
  CreateCompanyUpdateInput,
  CreateInterviewInput,
  CreateStudentInput,
  DashboardStats,
  ExecutiveDashboardStats,
  Interview,
  Notification,
  Student,
  StudentFilters,
  TemperatureSnapshot,
  TimelineEvent,
} from "./types";

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

function syncStudentCA(student: Student, cas: Map<string, CAUser>): Student {
  const ca = cas.get(student.assignedCaId);
  const name = ca?.name ?? student.assignedCaName ?? student.assignedCA;
  return {
    ...student,
    assignedCaName: name,
    assignedCA: name,
  };
}

class MockRepository implements DataRepository {
  private students: Map<string, Student>;
  private interviews: Map<string, Interview>;
  private analyses: Map<string, AIAnalysis>;
  private notifications: Map<string, Notification>;
  private cas: Map<string, CAUser>;
  private companyUpdates: Map<string, CompanyUpdate>;
  private companies: Map<string, Company>;
  private knowledgeItems: Map<string, KnowledgeItem>;
  private seedAlerts: Alert[];

  constructor() {
    this.cas = new Map((caUsersSeed as CAUser[]).map((c) => [c.id, clone(c)]));
    this.students = new Map(
      (studentsSeed as Student[]).map((s) => {
        const synced = syncStudentCA(clone(s), this.cas);
        return [synced.id, synced];
      })
    );
    this.interviews = new Map(
      (interviewsSeed as Interview[]).map((i) => [i.id, clone(i)])
    );
    this.analyses = new Map(
      (aiAnalysisSeed as AIAnalysis[]).map((a) => [a.id, clone(a)])
    );
    this.notifications = new Map(
      (notificationsSeed as Notification[]).map((n) => [n.id, clone(n)])
    );
    this.companyUpdates = new Map(
      (companyUpdatesSeed as CompanyUpdate[]).map((u) => [u.id, clone(u)])
    );
    this.seedAlerts = clone(alertsSeed as Alert[]);
    this.companies = new Map(
      (companiesSeed as Company[]).map((c) => [c.id, clone(c)])
    );
    this.knowledgeItems = new Map(
      (knowledgeItemsSeed as KnowledgeItem[]).map((k) => [k.id, clone(k)])
    );
  }

  private allStudents(): Student[] {
    return Array.from(this.students.values());
  }

  private allInterviews(): Interview[] {
    return Array.from(this.interviews.values());
  }

  private getMergedAlerts(): Alert[] {
    return mergeAlerts(this.seedAlerts, this.allStudents());
  }

  private enrichedCAs(): CAUser[] {
    const alerts = this.getMergedAlerts();
    const students = this.allStudents();
    const interviews = this.allInterviews();
    return Array.from(this.cas.values()).map((ca) => {
      const base = enrichCAStats(ca, students, interviews, alerts);
      const metrics = buildCAPerformanceMetrics(base, students, interviews);
      return enrichCAWithPerformance(base, metrics);
    });
  }

  async listStudents(filters?: StudentFilters): Promise<Student[]> {
    let list = this.allStudents().sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    if (filters?.name) {
      const q = filters.name.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }
    if (filters?.university) {
      const q = filters.university.toLowerCase();
      list = list.filter((s) => s.university.toLowerCase().includes(q));
    }
    if (filters?.status) {
      list = list.filter((s) => s.status === filters.status);
    }
    if (filters?.assignedCaId) {
      list = list.filter((s) => s.assignedCaId === filters.assignedCaId);
    }

    return clone(list);
  }

  async getStudent(id: string): Promise<Student | null> {
    const student = this.students.get(id);
    return student ? clone(student) : null;
  }

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    const existing = this.students.get(id);
    if (!existing) throw new Error("Student not found");
    let updated: Student = {
      ...existing,
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    if (data.assignedCaId) {
      updated = syncStudentCA(updated, this.cas);
    }
    if (data.memo !== undefined || data.contactMemo !== undefined) {
      updated.lastMemoUpdatedAt = new Date().toISOString();
    }
    this.students.set(id, updated);
    return clone(updated);
  }

  async createStudent(input: CreateStudentInput): Promise<Student> {
    const ca = this.cas.get(input.assignedCaId);
    const now = input.createdAt ?? new Date().toISOString();
    const student: Student = {
      id: `stu-${Date.now()}`,
      name: input.name,
      university: input.university,
      grade: input.grade,
      industry: input.industry,
      targetCompanies: input.targetCompanies,
      temperature: input.temperature,
      status: input.status,
      assignedCaId: input.assignedCaId,
      assignedCaName: ca?.name ?? "",
      assignedCA: ca?.name ?? "",
      memo: input.memo,
      esMemo: "",
      contactMemo: "",
      lastReplyAt: now,
      lastContactAt: now,
      lastInterviewAt: "",
      lastMemoUpdatedAt: now,
      unreadDays: 0,
      nextAction: "",
      nextActionDue: "",
      riskReason: "",
      interviewDeclined: false,
      interviewCancelled: false,
      interviewStatus: [],
      createdAt: now,
      updatedAt: now,
    };
    this.students.set(student.id, student);
    return clone(student);
  }

  async listInterviews(studentId: string): Promise<Interview[]> {
    const list = this.allInterviews()
      .filter((i) => i.studentId === studentId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return clone(list);
  }

  async createInterview(data: CreateInterviewInput): Promise<Interview> {
    const interview: Interview = {
      id: `int-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.interviews.set(interview.id, interview);
    const student = this.students.get(data.studentId);
    if (student) {
      this.students.set(data.studentId, {
        ...student,
        lastInterviewAt: interview.createdAt,
        updatedAt: interview.createdAt,
      });
    }
    return clone(interview);
  }

  async getLatestAnalysis(studentId: string): Promise<AIAnalysis | null> {
    const list = Array.from(this.analyses.values())
      .filter((a) => a.studentId === studentId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return list[0] ? clone(list[0]) : null;
  }

  async getAnalysis(id: string): Promise<AIAnalysis | null> {
    const analysis = this.analyses.get(id);
    return analysis ? clone(analysis) : null;
  }

  async createAnalysis(data: CreateAnalysisInput): Promise<AIAnalysis> {
    const analysis: AIAnalysis = {
      id: `ai-${Date.now()}`,
      executiveNotes:
        data.executiveNotes ??
        "離脱リスクと次回アクションの設定状況を代表が確認してください。",
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.analyses.set(analysis.id, analysis);
    return clone(analysis);
  }

  async listNotifications(): Promise<Notification[]> {
    const list = Array.from(this.notifications.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return clone(list);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const exec = await this.getExecutiveDashboard();
    return {
      totalStudents: exec.totalStudents,
      atRiskCount: exec.atRiskCount,
      todayInterviews: exec.weeklyInterviews,
      recentStudents: exec.priorityStudents.slice(0, 5).map((p) => p.student),
    };
  }

  async listCAs(): Promise<CAUser[]> {
    return clone(
      this.enrichedCAs().sort((a, b) => b.riskStudentCount - a.riskStudentCount)
    );
  }

  async getCA(id: string): Promise<CAUser | null> {
    const ca = this.enrichedCAs().find((c) => c.id === id);
    return ca ? clone(ca) : null;
  }

  async listStudentsByCA(caId: string): Promise<Student[]> {
    return this.listStudents({ assignedCaId: caId });
  }

  async listCompanyUpdates(): Promise<CompanyUpdate[]> {
    const list = Array.from(this.companyUpdates.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return clone(list);
  }

  async createCompanyUpdate(
    input: CreateCompanyUpdateInput
  ): Promise<CompanyUpdate> {
    const now = new Date().toISOString();
    const update: CompanyUpdate = {
      id: `cu-${Date.now()}`,
      ...input,
      shareStatus: input.shareStatus ?? "unshared",
      aiSummary: "",
      lineShareText: "",
      createdAt: now,
      updatedAt: now,
    };
    this.companyUpdates.set(update.id, update);
    return clone(update);
  }

  async updateCompanyUpdate(
    id: string,
    data: Partial<CompanyUpdate>
  ): Promise<CompanyUpdate> {
    const existing = this.companyUpdates.get(id);
    if (!existing) throw new Error("Company update not found");
    const updated: CompanyUpdate = {
      ...existing,
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    this.companyUpdates.set(id, updated);
    return clone(updated);
  }

  async listAlerts(filters?: AlertFilters): Promise<Alert[]> {
    let list = this.getMergedAlerts();
    if (filters?.severity) {
      list = list.filter((a) => a.severity === filters.severity);
    }
    if (filters?.caId) {
      list = list.filter((a) => a.relatedCaId === filters.caId);
    }
    if (filters?.unresolvedOnly !== false) {
      list = list.filter((a) => !a.resolved);
    }
    return clone(list);
  }

  private analysisMap(): Map<string, import("./types").AIAnalysis> {
    const map = new Map<string, import("./types").AIAnalysis>();
    for (const a of this.analyses.values()) {
      const existing = map.get(a.studentId);
      if (
        !existing ||
        new Date(a.createdAt) > new Date(existing.createdAt)
      ) {
        map.set(a.studentId, a);
      }
    }
    return map;
  }

  async getExecutiveDashboard(): Promise<ExecutiveDashboardStats> {
    const students = this.allStudents();
    const interviews = this.allInterviews();
    const alerts = this.getMergedAlerts();
    const updates = Array.from(this.companyUpdates.values());
    const cas = this.enrichedCAs();
    const weeklyInterviews = interviews.filter(
      (i) => Date.now() - new Date(i.createdAt).getTime() <= 7 * 86400000
    ).length;

    const caAttentionList = buildCAAttentionSummaries(
      cas,
      students,
      interviews
    );
    const pending = pendingCompanyUpdates(updates);
    const todayCompanyUpdates = updates.filter(
      (u) =>
        isDateToday(u.createdAt) ||
        (u.shareStatus === "unshared" && u.priority === "high")
    );
    const operationInsights = buildOperationInsights(students, cas);
    const interventions = buildExecutiveInterventions(
      students,
      cas,
      caAttentionList,
      updates
    );
    const priorityCards = buildPriorityCards(
      students,
      this.analysisMap(),
      interventions
    );
    const allActivity = mergeActivityLogs(
      undefined,
      students,
      interviews,
      updates
    );
    const activityFeed = getTodayActivityFeed(allActivity);
    const layeredAlerts = buildLayeredAlerts(
      alerts,
      students,
      allActivity
    );
    const companyList = Array.from(this.companies.values());
    const knowledgeAll = Array.from(this.knowledgeItems.values());

    return {
      totalStudents: students.length,
      totalCAs: this.cas.size,
      atRiskCount: students.filter((s) => s.temperature === "at_risk").length,
      weeklyInterviews,
      unresponsiveCount: countUnresponsive(students),
      selectingCount: countSelecting(students),
      offerCount: countOffers(students),
      criticalAlerts: clone(
        alerts.filter((a) => a.severity === "critical").slice(0, 8)
      ),
      priorityStudents: clone(buildPriorityStudents(students).slice(0, 10)),
      priorityCards: clone(priorityCards),
      caSummaries: clone(cas),
      caAttentionList: clone(caAttentionList),
      pendingCompanyUpdates: clone(pending),
      todayCompanyUpdates: clone(todayCompanyUpdates),
      operationInsights: clone(operationInsights),
      interventions: clone(interventions),
      activityFeed: clone(activityFeed),
      layeredAlerts: clone(layeredAlerts),
      caOperationsSummary: clone(buildCAOperationsSummary(cas)),
      companyShareSummary: clone(
        buildCompanyShareSummary(companyList, students, updates)
      ),
      knowledgeCandidates: clone(pickKnowledgeCandidates(knowledgeAll)),
    };
  }

  async getStudentTimeline(studentId: string): Promise<TimelineEvent[]> {
    const student = this.students.get(studentId);
    if (!student) return [];
    const history = getTemperatureHistoryForStudent(student);
    return clone(
      buildStudentTimeline(student, this.allInterviews(), history)
    );
  }

  async getTemperatureHistory(
    studentId: string
  ): Promise<TemperatureSnapshot[]> {
    const student = this.students.get(studentId);
    if (!student) return [];
    return clone(getTemperatureHistoryForStudent(student));
  }

  async listActivityLogs(): Promise<ActivityLog[]> {
    const students = this.allStudents();
    const interviews = this.allInterviews();
    const updates = Array.from(this.companyUpdates.values());
    return clone(mergeActivityLogs(undefined, students, interviews, updates));
  }

  async listCompanies(): Promise<CompanyListItem[]> {
    const students = this.allStudents();
    const cas = this.enrichedCAs();
    const updates = Array.from(this.companyUpdates.values());
    return clone(
      buildCompanyListItems(
        Array.from(this.companies.values()),
        students,
        cas,
        updates
      )
    );
  }

  async getCompany(id: string): Promise<CompanyDetail | null> {
    const company = this.companies.get(id);
    if (!company) return null;
    return clone(
      buildCompanyDetail(
        company,
        this.allStudents(),
        this.enrichedCAs(),
        Array.from(this.companyUpdates.values())
      )
    );
  }

  async listKnowledge(category?: string): Promise<KnowledgeItem[]> {
    let list = Array.from(this.knowledgeItems.values());
    if (category) {
      list = list.filter((k) => k.category === category);
    }
    return clone(
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
  }

  async getCADashboard(caId: string): Promise<CADashboardStats | null> {
    const ca = await this.getCA(caId);
    if (!ca) return null;
    const students = await this.listStudentsByCA(caId);
    const atRiskStudents = students.filter((s) => s.temperature === "at_risk");
    const actionStudents = buildPriorityStudents(students)
      .slice(0, 5)
      .map((p) => p.student);
    const performance = buildCAPerformanceMetrics(
      ca,
      this.allStudents(),
      this.allInterviews()
    );
    const { critical, attention } = classifyCARiskStudents(students);

    const suggestions: string[] = [performance.aiComment];
    if (ca.riskStudentCount > 0) {
      suggestions.push(
        `離脱リスク学生が${ca.riskStudentCount}名います。本日の優先フォローを設定してください。`
      );
    }
    if (ca.weeklyInterviewCount < 2) {
      suggestions.push("今週の面談記録が少なめです。面談機会の確保を検討してください。");
    }
    if (ca.performanceStatus === "needs_support") {
      suggestions.push("メモ更新・返信フォローのリズムを週次で確認することを推奨します。");
    }
    return {
      ca,
      students,
      atRiskStudents,
      actionStudents,
      supportSuggestions: suggestions,
      performance,
      riskStudentsCritical: critical,
      riskStudentsAttention: attention,
    };
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __mockRepository: MockRepository | undefined;
}

export function getMockRepository(): MockRepository {
  if (!global.__mockRepository) {
    global.__mockRepository = new MockRepository();
  }
  return global.__mockRepository;
}
