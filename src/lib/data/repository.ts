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
  ActivityLog,
  Company,
  CompanyDetail,
  CompanyListItem,
  ExecutiveDashboardStats,
  Interview,
  InterviewRecord,
  KnowledgeItem,
  Notification,
  Student,
  StudentFilters,
  TemperatureSnapshot,
  TimelineEvent,
} from "./types";

export interface AlertFilters {
  severity?: string;
  caId?: string;
  unresolvedOnly?: boolean;
}

export interface DataRepository {
  listStudents(filters?: StudentFilters): Promise<Student[]>;
  getStudent(id: string): Promise<Student | null>;
  updateStudent(id: string, data: Partial<Student>): Promise<Student>;
  createStudent(input: CreateStudentInput): Promise<Student>;
  listInterviews(studentId: string): Promise<Interview[]>;
  createInterview(data: CreateInterviewInput): Promise<Interview>;
  getLatestAnalysis(studentId: string): Promise<AIAnalysis | null>;
  getAnalysis(id: string): Promise<AIAnalysis | null>;
  getInterviewRecordByAnalysisId(
    analysisId: string
  ): Promise<InterviewRecord | null>;
  listInterviewRecordsByStudent(
    studentId: string
  ): Promise<InterviewRecord[]>;
  listInterviewRecordsByCA(caId: string): Promise<InterviewRecord[]>;
  createAnalysis(data: CreateAnalysisInput): Promise<AIAnalysis>;
  listNotifications(): Promise<Notification[]>;
  getDashboardStats(): Promise<DashboardStats>;
  listCAs(): Promise<CAUser[]>;
  getCA(id: string): Promise<CAUser | null>;
  listStudentsByCA(caId: string): Promise<Student[]>;
  listCompanyUpdates(): Promise<CompanyUpdate[]>;
  createCompanyUpdate(input: CreateCompanyUpdateInput): Promise<CompanyUpdate>;
  updateCompanyUpdate(
    id: string,
    data: Partial<CompanyUpdate>
  ): Promise<CompanyUpdate>;
  listAlerts(filters?: AlertFilters): Promise<Alert[]>;
  getExecutiveDashboard(): Promise<ExecutiveDashboardStats>;
  getCADashboard(caId: string): Promise<CADashboardStats | null>;
  getStudentTimeline(studentId: string): Promise<TimelineEvent[]>;
  getTemperatureHistory(studentId: string): Promise<TemperatureSnapshot[]>;
  listActivityLogs(): Promise<ActivityLog[]>;
  listCompanies(): Promise<CompanyListItem[]>;
  getCompany(id: string): Promise<CompanyDetail | null>;
  listKnowledge(category?: string): Promise<KnowledgeItem[]>;
}
