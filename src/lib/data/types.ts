export type Temperature = "high" | "medium" | "low" | "at_risk";

export type StudentStatus =
  | "before_interview"
  | "self_analysis"
  | "es_writing"
  | "introducing"
  | "selecting"
  | "offer"
  | "at_risk_status"
  | "paused"
  | "placed";

export type ShareStatus =
  | "unshared"
  | "shared_ca"
  | "shared_student"
  | "completed";

export type AlertSeverity = "info" | "warning" | "critical";

export type AlertType =
  | "memo_stale"
  | "contact_stale"
  | "no_next_action"
  | "selection_stale"
  | "temperature"
  | "ca_variance"
  | "company_update"
  | "general";

export type CAPerformanceStatus = "excellent" | "good" | "needs_support";

export type PriorityLayer = "critical" | "attention" | "info";

export type ActivityLogType =
  | "interview_completed"
  | "temperature_changed"
  | "es_reviewed"
  | "company_update"
  | "no_reply"
  | "memo_updated"
  | "next_action_missing";

export type ActivityLogSeverity = "critical" | "attention" | "info";

export type KnowledgeCategory =
  | "gakuchika"
  | "self_analysis"
  | "es_review"
  | "interview"
  | "company_intro"
  | "retention"
  | "student_follow"
  | "ca_success"
  | "company_strategy";

export interface ActivityLog {
  id: string;
  type: ActivityLogType;
  title: string;
  description: string;
  relatedStudentId?: string;
  relatedStudentName?: string;
  relatedCaId?: string;
  relatedCaName?: string;
  relatedCompanyId?: string;
  relatedCompanyName?: string;
  severity: ActivityLogSeverity;
  createdAt: string;
}

export interface LayeredItem {
  id: string;
  layer: PriorityLayer;
  title: string;
  description: string;
  relatedStudentId?: string;
  relatedStudentName?: string;
  relatedCaId?: string;
  relatedCaName?: string;
  relatedCompanyId?: string;
  relatedCompanyName?: string;
  createdAt: string;
}

export interface LayeredAlerts {
  critical: LayeredItem[];
  attention: LayeredItem[];
  info: LayeredItem[];
}

export interface CompanyKnowledge {
  interviewQuestions: string[];
  passedStudentTraits: string[];
  cautionNotes: string[];
  caShareMemo: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  targetProfile: string;
  desiredPersonality: string;
  hiringCount: number;
  selectionFlow: string;
  briefingSchedule: string;
  relatedCaIds: string[];
  activeStudentIds: string[];
  knowledge: CompanyKnowledge;
  lastUpdatedAt: string;
}

export interface CompanyListItem extends Company {
  selectingStudentCount: number;
  urgentContactCount: number;
  relatedCaNames: string[];
}

export interface CompanyStudentRow {
  student: Student;
  stage: string;
}

export interface CompanyDetail extends Company {
  relatedCaNames: string[];
  students: CompanyStudentRow[];
  urgentUpdates: CompanyUpdate[];
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: KnowledgeCategory;
  content: string;
  aiSummary: string;
  reusablePoint: string;
  createdByCaId: string;
  createdByCaName: string;
  relatedStudentId?: string;
  relatedStudentName?: string;
  relatedCompanyId?: string;
  relatedCompanyName?: string;
  createdAt: string;
}

export interface CAOperationsSummary {
  needsSupport: CAUser[];
  performing: CAUser[];
  stale: CAUser[];
}

export interface CompanyShareSummary {
  unsharedCount: number;
  todayShareCount: number;
  hotCompanies: { companyId: string; companyName: string; studentCount: number }[];
}

export interface CAPerformanceMetrics {
  ca: CAUser;
  studentCount: number;
  atRiskCount: number;
  weeklyInterviewCount: number;
  memoUpdateRate: number;
  lastActivityAt: string;
  unresponsiveCount: number;
  avgTemperature: Temperature;
  selectingCount: number;
  offerCount: number;
  aiComment: string;
}

export interface InterviewStatusItem {
  company: string;
  stage: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  university: string;
  grade: string;
  industry: string;
  targetCompanies: string[];
  temperature: Temperature;
  status: StudentStatus;
  assignedCA: string;
  assignedCaId: string;
  assignedCaName: string;
  memo: string;
  esMemo: string;
  contactMemo: string;
  lastReplyAt: string;
  lastContactAt: string;
  lastInterviewAt: string;
  lastMemoUpdatedAt: string;
  unreadDays: number;
  nextAction: string;
  nextActionDue: string;
  nextActionAssignee?: "ca" | "executive";
  nextActionStatus?: "pending" | "done";
  riskReason: string;
  interviewDeclined: boolean;
  interviewCancelled: boolean;
  interviewStatus: InterviewStatusItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CAUser {
  id: string;
  name: string;
  role: string;
  studentCount: number;
  riskStudentCount: number;
  highTempCount: number;
  weeklyInterviewCount: number;
  openAlertCount: number;
  lastActivityAt: string;
  memo: string;
  performanceStatus: CAPerformanceStatus;
  memoUpdateRate?: number;
  unresponsiveCount?: number;
  selectingCount?: number;
  offerCount?: number;
  aiComment?: string;
}

export interface Interview {
  id: string;
  studentId: string;
  audioUrl: string;
  transcript: string;
  summary: string;
  analysisId?: string;
  createdAt: string;
}

export type AnalysisSource = "audio" | "memo";

export interface AIAnalysis {
  id: string;
  studentId: string;
  interviewId?: string;
  summary: string;
  personality: string;
  strengths: string[];
  weaknesses: string[];
  orientation: string;
  anxiety: string[];
  nextActions: string[];
  recommendedCompanies: string[];
  caRecommendedActions?: string[];
  executiveNotes?: string;
  temperatureAnalysis: string;
  temperatureScore: string;
  source?: AnalysisSource;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: "alert" | "info";
  title: string;
  message: string;
  studentId?: string;
  read: boolean;
  createdAt: string;
}

export interface CompanyUpdate {
  id: string;
  companyName: string;
  title: string;
  content: string;
  priority: "high" | "medium" | "low";
  relatedCaIds: string[];
  relatedStudentIds: string[];
  shareStatus: ShareStatus;
  deadline: string;
  aiSummary: string;
  lineShareText: string;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  relatedCaId?: string;
  relatedStudentId?: string;
  severity: AlertSeverity;
  resolved: boolean;
  createdAt: string;
}

export interface StudentFilters {
  name?: string;
  university?: string;
  status?: StudentStatus;
  assignedCaId?: string;
}

export interface DashboardStats {
  totalStudents: number;
  atRiskCount: number;
  todayInterviews: number;
  recentStudents: Student[];
}

export type TimelineEventType =
  | "interview"
  | "memo"
  | "contact"
  | "temperature"
  | "selection"
  | "follow"
  | "status";

export interface TimelineEvent {
  id: string;
  studentId: string;
  type: TimelineEventType;
  title: string;
  description: string;
  occurredAt: string;
  severity?: AlertSeverity;
}

export interface TemperatureSnapshot {
  studentId: string;
  temperature: Temperature;
  recordedAt: string;
}

export interface PriorityStudentCard {
  student: Student;
  score: number;
  reasons: string[];
  recommendedAction: string;
  lastContactLabel: string;
  needsExecutiveAttention: boolean;
  temperatureDroppedRecently: boolean;
  priorityLayer: PriorityLayer;
}

export interface CAAttentionSummary {
  ca: CAUser;
  studentCount: number;
  atRiskCount: number;
  staleInterviewCount: number;
  interviewUpdateRate: number;
  weeklyInterviewCount: number;
  delayedReplyCount: number;
  highTempCount: number;
  aiComment: string;
}

export interface OperationInsight {
  id: string;
  category: string;
  message: string;
  severity: AlertSeverity;
}

export interface ExecutiveIntervention {
  id: string;
  targetType: "student" | "ca";
  targetId: string;
  targetName: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  relatedCaId?: string;
  relatedStudentId?: string;
}

export interface ExecutiveDashboardStats {
  totalStudents: number;
  totalCAs: number;
  atRiskCount: number;
  weeklyInterviews: number;
  unresponsiveCount: number;
  selectingCount: number;
  offerCount: number;
  criticalAlerts: Alert[];
  priorityStudents: PriorityStudent[];
  priorityCards: PriorityStudentCard[];
  caSummaries: CAUser[];
  caAttentionList: CAAttentionSummary[];
  pendingCompanyUpdates: CompanyUpdate[];
  todayCompanyUpdates: CompanyUpdate[];
  operationInsights: OperationInsight[];
  interventions: ExecutiveIntervention[];
  activityFeed: ActivityLog[];
  layeredAlerts: LayeredAlerts;
  caOperationsSummary: CAOperationsSummary;
  companyShareSummary: CompanyShareSummary;
  knowledgeCandidates: KnowledgeItem[];
}

export interface CADashboardStats {
  ca: CAUser;
  students: Student[];
  atRiskStudents: Student[];
  actionStudents: Student[];
  supportSuggestions: string[];
  performance: CAPerformanceMetrics;
  riskStudentsCritical: Student[];
  riskStudentsAttention: Student[];
}

export interface PriorityStudent {
  student: Student;
  score: number;
  reasons: string[];
}

export interface CreateInterviewInput {
  studentId: string;
  audioUrl: string;
  transcript: string;
  summary: string;
  analysisId?: string;
}

export interface CreateAnalysisInput {
  studentId: string;
  interviewId?: string;
  summary: string;
  personality: string;
  strengths: string[];
  weaknesses: string[];
  orientation: string;
  anxiety: string[];
  nextActions: string[];
  recommendedCompanies: string[];
  caRecommendedActions?: string[];
  executiveNotes?: string;
  temperatureAnalysis: string;
  temperatureScore: string;
  source?: AnalysisSource;
}

export interface CreateStudentInput {
  name: string;
  university: string;
  grade: string;
  assignedCaId: string;
  industry: string;
  targetCompanies: string[];
  status: StudentStatus;
  temperature: Temperature;
  memo: string;
  createdAt?: string;
}

export interface CreateCompanyUpdateInput {
  companyName: string;
  title: string;
  content: string;
  priority: "high" | "medium" | "low";
  relatedCaIds: string[];
  relatedStudentIds: string[];
  shareStatus?: ShareStatus;
  deadline: string;
}

export const TEMPERATURE_LABELS: Record<Temperature, string> = {
  high: "高",
  medium: "中",
  low: "低",
  at_risk: "離脱リスク",
};

export const STATUS_LABELS: Record<StudentStatus, string> = {
  before_interview: "初回面談前",
  self_analysis: "自己分析中",
  es_writing: "ES作成中",
  introducing: "企業紹介中",
  selecting: "選考中",
  offer: "内定",
  at_risk_status: "離脱リスク",
  paused: "停止中",
  placed: "内定承諾",
};

export const SHARE_STATUS_LABELS: Record<ShareStatus, string> = {
  unshared: "未共有",
  shared_ca: "CAへ共有済み",
  shared_student: "学生へ共有済み",
  completed: "対応完了",
};

export const PERFORMANCE_LABELS: Record<CAPerformanceStatus, string> = {
  excellent: "好調",
  good: "安定",
  needs_support: "要支援",
};

export const PRIORITY_LAYER_LABELS: Record<PriorityLayer, string> = {
  critical: "今すぐ介入",
  attention: "今日中に確認",
  info: "確認のみ",
};

export const KNOWLEDGE_CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  gakuchika: "ガクチカ深掘り",
  self_analysis: "自己分析",
  es_review: "ES添削",
  interview: "面接対策",
  company_intro: "企業紹介",
  retention: "離脱防止",
  student_follow: "学生フォロー",
  ca_success: "CA成功事例",
  company_strategy: "企業別対策",
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityLogType, string> = {
  interview_completed: "面談",
  temperature_changed: "温度感",
  es_reviewed: "ES",
  company_update: "企業連絡",
  no_reply: "未返信",
  memo_updated: "メモ",
  next_action_missing: "アクション",
};
