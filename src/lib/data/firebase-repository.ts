import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { isDateToday } from "@/lib/utils/dates";
import { getMockRepository } from "./mock-repository";
import type { AlertFilters, DataRepository } from "./repository";
import type {
  AIAnalysis,
  Alert,
  CAUser,
  CADashboardStats,
  CompanyUpdate,
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
} from "./types";

function tsToIso(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
}

function docToStudent(id: string, data: Record<string, unknown>): Student {
  return {
    id,
    name: String(data.name ?? ""),
    university: String(data.university ?? ""),
    grade: String(data.grade ?? ""),
    industry: String(data.industry ?? ""),
    targetCompanies: (data.targetCompanies as string[]) ?? [],
    temperature: (data.temperature as Student["temperature"]) ?? "medium",
    status: (data.status as Student["status"]) ?? "self_analysis",
    assignedCA: String(data.assignedCA ?? data.assignedCaName ?? ""),
    assignedCaId: String(data.assignedCaId ?? ""),
    assignedCaName: String(data.assignedCaName ?? data.assignedCA ?? ""),
    memo: String(data.memo ?? ""),
    esMemo: String(data.esMemo ?? ""),
    contactMemo: String(data.contactMemo ?? ""),
    lastReplyAt: tsToIso(data.lastReplyAt),
    lastContactAt: tsToIso(data.lastContactAt ?? data.lastReplyAt),
    lastInterviewAt: tsToIso(data.lastInterviewAt),
    lastMemoUpdatedAt: tsToIso(data.lastMemoUpdatedAt ?? data.updatedAt),
    nextAction: String(data.nextAction ?? ""),
    nextActionDue: tsToIso(data.nextActionDue || data.updatedAt),
    riskReason: String(data.riskReason ?? ""),
    unreadDays: Number(data.unreadDays ?? 0),
    interviewDeclined: Boolean(data.interviewDeclined),
    interviewCancelled: Boolean(data.interviewCancelled),
    interviewStatus:
      (data.interviewStatus as Student["interviewStatus"]) ?? [],
    createdAt: tsToIso(data.createdAt),
    updatedAt: tsToIso(data.updatedAt),
  };
}

class FirebaseRepository implements DataRepository {
  private db = getAdminDb();

  async listStudents(filters?: StudentFilters): Promise<Student[]> {
    const snap = await this.db
      .collection("students")
      .orderBy("updatedAt", "desc")
      .get();

    let list = snap.docs.map((d) =>
      docToStudent(d.id, d.data() as Record<string, unknown>)
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

    return list;
  }

  async getStudent(id: string): Promise<Student | null> {
    const snap = await this.db.collection("students").doc(id).get();
    if (!snap.exists) return null;
    return docToStudent(snap.id, snap.data() as Record<string, unknown>);
  }

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    const ref = this.db.collection("students").doc(id);
    const { id: _id, createdAt: _c, ...rest } = data;
    await ref.update({
      ...rest,
      updatedAt: Timestamp.now(),
    });
    const updated = await this.getStudent(id);
    if (!updated) throw new Error("Student not found");
    return updated;
  }

  async listInterviews(studentId: string): Promise<Interview[]> {
    const snap = await this.db
      .collection("interviews")
      .where("studentId", "==", studentId)
      .orderBy("createdAt", "desc")
      .get();

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        studentId: String(data.studentId),
        audioUrl: String(data.audioUrl ?? ""),
        transcript: String(data.transcript ?? ""),
        summary: String(data.summary ?? ""),
        analysisId: data.analysisId as string | undefined,
        createdAt: tsToIso(data.createdAt),
      };
    });
  }

  async createInterview(data: CreateInterviewInput): Promise<Interview> {
    const ref = await this.db.collection("interviews").add({
      ...data,
      createdAt: Timestamp.now(),
    });
    return {
      id: ref.id,
      ...data,
      createdAt: new Date().toISOString(),
    };
  }

  async getLatestAnalysis(studentId: string): Promise<AIAnalysis | null> {
    const snap = await this.db
      .collection("ai_analysis")
      .where("studentId", "==", studentId)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snap.empty) return null;
    const d = snap.docs[0];
    return this.docToAnalysis(d.id, d.data());
  }

  async getAnalysis(id: string): Promise<AIAnalysis | null> {
    const snap = await this.db.collection("ai_analysis").doc(id).get();
    if (!snap.exists) return null;
    return this.docToAnalysis(
      snap.id,
      (snap.data() ?? {}) as Record<string, unknown>
    );
  }

  private docToAnalysis(
    id: string,
    data: Record<string, unknown>
  ): AIAnalysis {
    return {
      id,
      studentId: String(data.studentId),
      interviewId: data.interviewId as string | undefined,
      summary: String(data.summary ?? ""),
      personality: String(data.personality ?? ""),
      strengths: (data.strengths as string[]) ?? [],
      weaknesses: (data.weaknesses as string[]) ?? [],
      orientation: String(data.orientation ?? ""),
      anxiety: (data.anxiety as string[]) ?? [],
      nextActions: (data.nextActions as string[]) ?? [],
      recommendedCompanies: (data.recommendedCompanies as string[]) ?? [],
      caRecommendedActions: (data.caRecommendedActions as string[]) ?? [],
      temperatureAnalysis: String(data.temperatureAnalysis ?? ""),
      temperatureScore: String(data.temperatureScore ?? ""),
      source: data.source as AIAnalysis["source"],
      createdAt: tsToIso(data.createdAt),
    };
  }

  async createAnalysis(data: CreateAnalysisInput): Promise<AIAnalysis> {
    const ref = await this.db.collection("ai_analysis").add({
      ...data,
      createdAt: Timestamp.now(),
    });
    return {
      id: ref.id,
      ...data,
      createdAt: new Date().toISOString(),
    };
  }

  async listNotifications(): Promise<Notification[]> {
    const snap = await this.db
      .collection("notifications")
      .orderBy("createdAt", "desc")
      .get();

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        type: (data.type as Notification["type"]) ?? "info",
        title: String(data.title),
        message: String(data.message),
        studentId: data.studentId as string | undefined,
        read: Boolean(data.read),
        createdAt: tsToIso(data.createdAt),
      };
    });
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const students = await this.listStudents();
    const interviewsSnap = await this.db.collection("interviews").get();
    const interviews = interviewsSnap.docs.map((d) => ({
      createdAt: tsToIso(d.data().createdAt),
    }));

    const recentStudents = [...students]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    return {
      totalStudents: students.length,
      atRiskCount: students.filter((s) => s.temperature === "at_risk").length,
      todayInterviews: interviews.filter((i) => isDateToday(i.createdAt))
        .length,
      recentStudents,
    };
  }

  async createStudent(input: CreateStudentInput): Promise<Student> {
    return getMockRepository().createStudent(input);
  }

  async listCAs(): Promise<CAUser[]> {
    return getMockRepository().listCAs();
  }

  async getCA(id: string): Promise<CAUser | null> {
    return getMockRepository().getCA(id);
  }

  async listStudentsByCA(caId: string): Promise<Student[]> {
    return getMockRepository().listStudentsByCA(caId);
  }

  async listCompanyUpdates(): Promise<CompanyUpdate[]> {
    return getMockRepository().listCompanyUpdates();
  }

  async createCompanyUpdate(
    input: CreateCompanyUpdateInput
  ): Promise<CompanyUpdate> {
    return getMockRepository().createCompanyUpdate(input);
  }

  async updateCompanyUpdate(
    id: string,
    data: Partial<CompanyUpdate>
  ): Promise<CompanyUpdate> {
    return getMockRepository().updateCompanyUpdate(id, data);
  }

  async listAlerts(filters?: AlertFilters): Promise<Alert[]> {
    return getMockRepository().listAlerts(filters);
  }

  async getExecutiveDashboard(): Promise<ExecutiveDashboardStats> {
    return getMockRepository().getExecutiveDashboard();
  }

  async getCADashboard(caId: string): Promise<CADashboardStats | null> {
    return getMockRepository().getCADashboard(caId);
  }

  async getStudentTimeline(studentId: string) {
    return getMockRepository().getStudentTimeline(studentId);
  }

  async getTemperatureHistory(studentId: string) {
    return getMockRepository().getTemperatureHistory(studentId);
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __firebaseRepository: FirebaseRepository | undefined;
}

export function getFirebaseRepository(): FirebaseRepository {
  if (!global.__firebaseRepository) {
    global.__firebaseRepository = new FirebaseRepository();
  }
  return global.__firebaseRepository;
}
