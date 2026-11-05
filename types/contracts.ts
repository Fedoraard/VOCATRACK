/**
 * CONTRACT TYPES DEFINITIONS (CT-01 s.d. CT-12)
 * Acuan: SPESIFIKASI.md v1.0 & PRD.md v1.13
 * 
 * Semua kontrak logis bertipe untuk memisahkan integrasi backend dari komponen UI frontend.
 */

// ==========================================
// 1. STANDARD ERROR ENVELOPE & IDEMPOTENCY
// ==========================================

export interface ApiErrorDetail {
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
  correlationId?: string;
  retryable?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiErrorDetail;
  correlationId?: string;
}

export interface IdempotentRequest {
  idempotencyKey?: string;
}

// ==========================================
// 2. CT-01: IDENTITAS & KONTEKS AKSES (F-01)
// ==========================================

export type UserRole = 'STUDENT' | 'REVIEWER' | 'ADMIN';

export interface AccountContext {
  id: string;
  email: string;
  namaLengkap: string;
  asalSekolah: string;
  role: UserRole;
  jurusanDiminati?: string;
  fotoProfil?: string;
  isEmailVerified: boolean;
  authProvider: 'email' | 'google';
  createdAt: string;
}

// ==========================================
// 3. CT-02: KURIKULUM & PRASYARAT (F-03, F-04, F-05)
// ==========================================

export type ModuleCategory = 'FONDASI' | 'FRONTEND' | 'BACKEND' | 'MOBILE';

export interface RequiredVideoSegment {
  startMs: number;
  endMs: number;
  label?: string;
}

export interface PracticeItem {
  id: string;
  question: string;
  options: string[];
  explanation: string;
  kunciIndex: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
}

export interface ModuleVersion {
  id: string; // e.g. 'FND-01', 'FE-01', 'MO-01'
  title: string;
  subtitle: string;
  category: ModuleCategory;
  order: number;
  description: string;
  readingContent: string;
  videoAssetUrl: string;
  videoDurationSeconds: number;
  requiredSegments: RequiredVideoSegment[];
  prerequisiteModuleIds: string[];
  isCoreRecommendation: boolean; // Menandai 6 evaluasi inti (FND-01..03, FE-01, BE-01, MO-01)
  practiceItems: PracticeItem[];
  faqItems: FaqItem[];
  xpReward: number;
  version: string;
}

export interface PrerequisiteStatus {
  moduleId: string;
  isUnlocked: boolean;
  missingPrerequisiteTitles: string[];
}

export interface CurriculumRelease {
  releaseId: string;
  version: string;
  modules: ModuleVersion[];
}

// ==========================================
// 4. CT-03: SINKRONISASI AKTIVITAS BELAJAR (F-05, F-06, F-11)
// ==========================================

export type LearningEventKind = 'READ' | 'PRACTICE' | 'WATCH';

export interface BaseLearningEvent {
  eventId: string;
  moduleId: string;
  kind: LearningEventKind;
  timestamp: string;
}

export interface ReadLearningEvent extends BaseLearningEvent {
  kind: 'READ';
  completed: boolean;
  scrollPercentage: number;
}

export interface PracticeLearningEvent extends BaseLearningEvent {
  kind: 'PRACTICE';
  practiceItemId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
}

export interface WatchLearningEvent extends BaseLearningEvent {
  kind: 'WATCH';
  watchedRanges: Array<{ startMs: number; endMs: number }>;
  totalCoveredMs: number;
  isCompleted100Percent: boolean;
}

export type LearningEvent = ReadLearningEvent | PracticeLearningEvent | WatchLearningEvent;

export interface SyncLearningEventsResult {
  acceptedEventIds: string[];
  rejectedEventIds: Array<{ eventId: string; reason: string }>;
  progressVersion: number;
}

// ==========================================
// 5. CT-04: PEMERIKSAAN KEMAMPUAN AWAL (F-02)
// ==========================================

export interface PlacementIndicator {
  id: string; // 'PLC-01' s.d. 'PLC-09'
  moduleId: string;
  moduleTitle: string;
  pertanyaan: string;
  pilihan: string[];
  kunciIndex: number; // 0..3, index ke-4 adalah "Belum Tahu"
}

export interface PlacementAnswer {
  indicatorId: string;
  selectedOptionIndex: number; // -1 jika belum tahu
}

export interface PlacementResult {
  packageVersionId: string;
  rekomendasiTitikMulaiModuleId: string;
  eligibleDirectEvaluationModuleIds: string[];
  summaryNote: string;
  evaluatedAt: string;
}

// ==========================================
// 6. CT-05 & CT-06: EVALUASI RESMI & PENILAIAN (F-07, F-08)
// ==========================================

export type AssessmentQuestionType = 'CASE' | 'STRUCTURED_CODE';

export interface QuestionInstance {
  questionInstanceId: string;
  orderNumber: number;
  type: AssessmentQuestionType;
  prompt: string;
  codeSnippet?: string;
  options: string[];
  // KUNCI JAWABAN TIDAK ADA DI SINI (Kunci hanya ada di server)
}

export type AssessmentStatus = 'ACTIVE' | 'SUBMITTED' | 'PROCESSING' | 'GRADED';

export interface OfficialAttempt {
  attemptId: string;
  moduleId: string;
  moduleTitle: string;
  blueprintVersionId: string;
  startedAt: string;
  deadlineAt: string;
  serverNow: string;
  questions: QuestionInstance[];
  durationMinutes: number;
  status: AssessmentStatus;
}

export interface AnswerSubmissionItem {
  questionInstanceId: string;
  selectedOptionIndex: number | null; // null jika belum dijawab
  answerVersion: number;
}

export interface OfficialResult {
  resultId: string;
  attemptId: string;
  moduleId: string;
  score: number; // 0 - 100
  isPassed: boolean; // score >= 70
  totalQuestions: number;
  correctAnswersCount: number;
  answeredCount: number;
  gradingVersion: string;
  finalizedAt: string;
  attemptSequence: number;
  explanations: Array<{
    questionInstanceId: string;
    orderNumber: number;
    kunciJawabanIndex: number;
    userAnswerIndex: number | null;
    isCorrect: boolean;
    explanationText: string;
  }>;
}

// ==========================================
// 7. CT-07: PROGRES BELAJAR & PREFERENSI (F-03, F-04, F-08)
// ==========================================

export type LearningMode = 'DIRECTED' | 'EXPLORATION';

export interface ModuleProgress {
  moduleId: string;
  isUnlocked: boolean;
  isReadCompleted: boolean;
  isVideoCompleted100: boolean;
  practiceAnsweredCount: number;
  latestScore: number | null;
  hasPassedHistorically: boolean; // Pernah lulus (score >= 70)
  totalAttempts: number;
}

export interface ProgressProjection {
  ownerId: string;
  mode: LearningMode;
  targetCareerId?: string; // 'FRONTEND' | 'BACKEND' | 'MOBILE'
  modules: Record<string, ModuleProgress>;
  version: number;
  updatedAt: string;
}

// ==========================================
// 8. CT-08: MODEL REKOMENDASI 3 PROFESI (F-09)
// ==========================================

export type CareerTrackId = 'FRONTEND' | 'BACKEND' | 'MOBILE';

export interface CareerScoreResult {
  careerId: CareerTrackId;
  careerTitle: string;
  score: number; // 0 - 100
  rank: number;
  supportingFactors: string[];
}

export interface EvidenceCoverage {
  isEligible: boolean; // minimal 6 modul inti terjawab >= 6 soal
  missingEvidenceModuleIds: string[];
  answeredCountsByScope: Record<string, number>;
}

export interface RecommendationSnapshot {
  snapshotId: string;
  modelVersionId: string;
  isEligible: boolean;
  coverage: EvidenceCoverage;
  careerResults: CareerScoreResult[];
  isTieScore: boolean;
  isAllScoresLow: boolean; // Jika semua pengantar < 70
  interpretationNote: string;
  nextRecommendedSteps: string[];
  calculatedAt: string;
}

// ==========================================
// 9. CT-09: VOCABOT TUTOR & CURATED FALLBACK (F-10)
// ==========================================

export type TutorResponseMode = 'AI' | 'CURATED';

export interface TutorMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
  mode?: TutorResponseMode;
  sourceReferences?: string[];
}

export interface TutorReplyResult {
  messageId: string;
  replyText: string;
  mode: TutorResponseMode;
  remainingDailyQuota: number;
  sourceReferences: string[];
}

// ==========================================
// 10. CT-10, CT-11, CT-12: PROYEK SISWA & REVIEWER (F-12, F-13)
// ==========================================

export interface ProjectBrief {
  briefId: string;
  careerId: CareerTrackId;
  careerTitle: string;
  projectTheme: string; // 'Pengelola Tugas Belajar'
  technologyStack: string; // Frontend: React, Backend: Node.js/Express, Mobile: React Native/Expo
  databaseTech?: string; // Backend: PostgreSQL
  coreFeatures: string[]; // CRUD tugas, status TODO/DONE, pencarian/filter, validasi, integrasi API
  submissionGuidelines: string[];
}

export type SubmissionStatus = 'PENDING' | 'RUNNING_CHECKS' | 'TECHNICAL_REVIEW' | 'NEEDS_REVISION' | 'PASSED';

export interface ProjectSubmission {
  submissionId: string;
  studentId: string;
  studentName: string;
  careerId: CareerTrackId;
  briefId: string;
  repositoryUrl: string;
  commitHash: string;
  runInstructions: string;
  demoVideoUrl: string;
  previousSubmissionId?: string | null;
  status: SubmissionStatus;
  submittedAt: string;
  coreChecksSummary?: {
    passedChecksCount: number;
    totalChecksCount: number;
    isCoreFeaturesAllPassed: boolean;
  };
  humanReviewFeedback?: string;
  reviewedAt?: string;
  reviewerName?: string;
}

export type RubricGrade = 'MET' | 'NOT_MET' | 'NOT_REVIEWED';

export interface HumanReviewInput {
  submissionId: string;
  rubricVersion: string;
  structureAndReadability: RubricGrade;
  implementationAccuracy: RubricGrade;
  understandingThroughDemo: RubricGrade;
  fieldSpecificQuality: RubricGrade;
  feedbackText: string;
  isInfrastructureIssue?: boolean;
}

