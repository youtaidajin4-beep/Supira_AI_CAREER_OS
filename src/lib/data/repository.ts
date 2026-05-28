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
}
