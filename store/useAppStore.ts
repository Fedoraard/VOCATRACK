import { create } from 'zustand';
import { UserProfile, JurusanVokasi, NodeBab, SkillStatus } from '../utils/types';
import { MOCK_JURUSAN, MOCK_SKILL_TREE_NODES } from '../utils/mockData';
import { LearningMode, CareerTrackId } from '../types/contracts';

interface ActiveAssessmentSession {
  attemptId: string;
  moduleId: string;
  moduleTitle: string;
}

interface AppState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  selectedJurusanId: string;
  jurusanList: JurusanVokasi[];
  nodes: NodeBab[];
  activeQuizId: string | null;
  
  // Pilot RPL 3 Profesi & Kontrak Kurikulum
  learningMode: LearningMode;
  targetCareer: CareerTrackId;
  activeAssessment: ActiveAssessmentSession | null;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  updateProfile: (profileData: Partial<UserProfile>) => void;
  setSelectedJurusanId: (id: string) => void;
  updateNodeStatus: (nodeId: string, status: SkillStatus) => void;
  addXp: (amount: number) => void;
  logout: () => void;
  setActiveQuizId: (quizId: string | null) => void;
  setLearningMode: (mode: LearningMode) => void;
  setTargetCareer: (career: CareerTrackId) => void;
  setActiveAssessment: (session: ActiveAssessmentSession | null) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'user-001',
  email: 'dipagntg12@gmail.com',
  namaLengkap: 'Galuh',
  asalSekolah: 'SMKN 1 Cimahi',
  jurusanDiminati: 'Rekayasa Perangkat Lunak',
  totalXp: 450,
  level: 2,
};

export const useAppStore = create<AppState>((set) => ({
  user: DEFAULT_USER,
  isAuthenticated: true,
  selectedJurusanId: 'jur-01',
  jurusanList: MOCK_JURUSAN,
  nodes: MOCK_SKILL_TREE_NODES,
  activeQuizId: null,

  learningMode: 'DIRECTED',
  targetCareer: 'FRONTEND',
  activeAssessment: null,

  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
  updateProfile: (profileData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...profileData } : null,
    })),
  setSelectedJurusanId: (id) => set({ selectedJurusanId: id }),
  updateNodeStatus: (nodeId, status) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === nodeId ? { ...n, status } : n)),
    })),
  addXp: (amount) =>
    set((state) => {
      if (!state.user) return state;
      const newXp = state.user.totalXp + amount;
      const newLevel = Math.floor(newXp / 300) + 1;
      return {
        user: { ...state.user, totalXp: newXp, level: newLevel },
      };
    }),
  logout: () => set({ user: null, isAuthenticated: false, activeAssessment: null, activeQuizId: null }),
  setActiveQuizId: (activeQuizId) => set({ activeQuizId }),
  setLearningMode: (learningMode) => set({ learningMode }),
  setTargetCareer: (targetCareer) => set({ targetCareer }),
  setActiveAssessment: (activeAssessment) => set({ activeAssessment, activeQuizId: activeAssessment?.attemptId || null }),
}));
