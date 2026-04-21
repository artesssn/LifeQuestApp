import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type EnvironmentType = 'residencial' | 'empresarial';
export type RoleType = 'guardiao' | 'heroi' | 'representante' | 'profissionais';
export type MissionKind = 'Diaria' | 'Semanal' | 'Desafio' | 'Contrato';
export type MissionState = 'available' | 'awaiting_approval' | 'approved' | 'reported_issue';
export type MissionDifficulty = 'Facil' | 'Media' | 'Dificil';
export type MissionDuration = 'Curta' | 'Media' | 'Longa';

type MissionCompletionRequest = {
  summary: string;
  delayReason: string;
  submittedAt: string;
};

type MissionIssueReport = {
  reason: string;
  submittedAt: string;
};

export type Mission = {
  id: string;
  title: string;
  description: string;
  category: MissionKind;
  difficulty: MissionDifficulty;
  duration: MissionDuration;
  dueLabel: string;
  xp: number;
  lq: number;
  state: MissionState;
  createdBy: string;
  createdAt: string;
  assigneeLabel: string;
  approvedAt?: string;
  completionRequest?: MissionCompletionRequest;
  issueReport?: MissionIssueReport;
};

type UserProfile = {
  name: string;
  role: RoleType;
  environment: EnvironmentType;
  limitation: string;
  companionId: 'fox' | 'owl';
};

type StoredAccount = {
  id: string;
  password: string;
  profile: UserProfile;
  missions: Mission[];
};

type JourneyDraft = Pick<UserProfile, 'environment' | 'role'>;

type CreateMissionInput = Pick<
  Mission,
  'title' | 'description' | 'category' | 'difficulty' | 'duration' | 'dueLabel' | 'lq'
>;

type RegisterPayload = Omit<UserProfile, 'role' | 'environment'> & {
  password: string;
};

type DemoContextValue = {
  isReady: boolean;
  hasAccounts: boolean;
  draftJourney: JourneyDraft | null;
  profile: UserProfile | null;
  missions: Mission[];
  activeMissions: Mission[];
  awaitingApprovalMissions: Mission[];
  approvedMissions: Mission[];
  issueReportedMissions: Mission[];
  totalXp: number;
  totalLq: number;
  completionRate: number;
  currentLevel: number;
  currentLevelXp: number;
  nextLevelXp: number;
  levelProgressPercent: number;
  authError: string | null;
  setJourney: (environment: EnvironmentType, role: RoleType) => void;
  registerProfile: (payload: RegisterPayload) => boolean;
  login: (name: string, password: string) => boolean;
  logout: () => void;
  createMission: (input: CreateMissionInput) => void;
  submitMissionForApproval: (payload: {
    missionId: string;
    summary: string;
    delayReason: string;
  }) => void;
  reportMissionIssue: (payload: { missionId: string; reason: string }) => void;
  approveMissionCompletion: (missionId: string) => void;
  reopenMission: (missionId: string) => void;
};

const STORAGE_KEY = 'lifequest-demo-state-v1';

const DemoContext = createContext<DemoContextValue | undefined>(undefined);

const DIFFICULTY_XP: Record<MissionDifficulty, number> = {
  Facil: 60,
  Media: 110,
  Dificil: 180,
};

const DURATION_XP: Record<MissionDuration, number> = {
  Curta: 20,
  Media: 55,
  Longa: 95,
};

function calculateXp(difficulty: MissionDifficulty, duration: MissionDuration) {
  return DIFFICULTY_XP[difficulty] + DURATION_XP[duration];
}

function buildMission(base: Omit<Mission, 'xp'>): Mission {
  return {
    ...base,
    xp: calculateXp(base.difficulty, base.duration),
  };
}

function getXpGoalForLevel(level: number) {
  return 180 + (level - 1) * 90;
}

function calculateLevelProgress(totalXp: number) {
  let level = 1;
  let remainingXp = totalXp;
  let xpGoal = getXpGoalForLevel(level);

  while (remainingXp >= xpGoal) {
    remainingXp -= xpGoal;
    level += 1;
    xpGoal = getXpGoalForLevel(level);
  }

  const levelProgressPercent = Math.min(100, Math.round((remainingXp / xpGoal) * 100));

  return {
    currentLevel: level,
    currentLevelXp: remainingXp,
    nextLevelXp: xpGoal,
    levelProgressPercent,
  };
}

const INITIAL_MISSIONS: Mission[] = [
  buildMission({
    id: 'mission-1',
    title: 'Organizar material da faculdade',
    description: 'Separar cadernos, documentos e checklist da semana.',
    category: 'Diaria',
    difficulty: 'Facil',
    duration: 'Curta',
    dueLabel: 'Hoje, 20:00',
    lq: 25,
    state: 'available',
    assigneeLabel: 'Jogador principal',
    createdBy: 'Sistema',
    createdAt: '2026-04-06T18:00:00.000Z',
  }),
  buildMission({
    id: 'mission-2',
    title: 'Revisar apresentacao do LifeQuest',
    description: 'Conferir roteiro, fluxo do app e narrativa da demonstracao.',
    category: 'Semanal',
    difficulty: 'Media',
    duration: 'Longa',
    dueLabel: 'Amanha, 10:00',
    lq: 40,
    state: 'awaiting_approval',
    assigneeLabel: 'Jogador principal',
    createdBy: 'Sistema',
    createdAt: '2026-04-06T18:20:00.000Z',
    completionRequest: {
      summary: 'Revisei os slides e testei a navegacao das telas.',
      delayReason: 'Atrasou porque precisei ajustar os textos antes.',
      submittedAt: '2026-04-06T21:10:00.000Z',
    },
  }),
  buildMission({
    id: 'mission-3',
    title: 'Cadastrar primeira missao do time',
    description: 'Mostrar que o gestor cria a missao e libera a jornada do usuario.',
    category: 'Contrato',
    difficulty: 'Dificil',
    duration: 'Media',
    dueLabel: 'Aprovada',
    lq: 35,
    state: 'approved',
    assigneeLabel: 'Jogador principal',
    createdBy: 'Sistema',
    createdAt: '2026-04-05T16:00:00.000Z',
    approvedAt: '2026-04-05T18:30:00.000Z',
    completionRequest: {
      summary: 'Fluxo validado em apresentacao interna.',
      delayReason: '',
      submittedAt: '2026-04-05T18:00:00.000Z',
    },
  }),
];

type StorageShape = {
  accounts: StoredAccount[];
};

export function LifeQuestDemoProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [draftJourney, setDraftJourney] = useState<JourneyDraft | null>(null);
  const [accounts, setAccounts] = useState<StoredAccount[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);

  useEffect(() => {
    const loadState = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);

        if (raw) {
          const parsed = JSON.parse(raw) as StorageShape;
          setAccounts(parsed.accounts ?? []);
        }
      } catch {
        setAccounts([]);
      } finally {
        setIsReady(true);
      }
    };

    void loadState();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    void AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        accounts,
      } satisfies StorageShape)
    );
  }, [accounts, isReady]);

  const activeAccount = useMemo(
    () => accounts.find((account) => account.id === activeAccountId) ?? null,
    [accounts, activeAccountId]
  );

  const profile = activeAccount?.profile ?? null;
  const missions = activeAccount?.missions ?? [];

  const setJourney = (environment: EnvironmentType, role: RoleType) => {
    setDraftJourney({ environment, role });
    setAuthError(null);
  };

  const registerProfile = ({
    name,
    limitation,
    companionId,
    password,
  }: RegisterPayload) => {
    if (!draftJourney) {
      return false;
    }

    const normalizedName = name.trim();
    const normalizedPassword = password.trim();

    if (!normalizedName || normalizedPassword.length < 4) {
      setAuthError('Preencha um nome valido e uma senha com pelo menos 4 caracteres.');
      return false;
    }

    const accountId = normalizedName.toLowerCase();
    const nextAccount: StoredAccount = {
      id: accountId,
      password: normalizedPassword,
      profile: {
        name: normalizedName,
        limitation: limitation.trim(),
        companionId,
        environment: draftJourney.environment,
        role: draftJourney.role,
      },
      missions: INITIAL_MISSIONS,
    };

    setAccounts((current) => {
      const withoutOld = current.filter((account) => account.id !== accountId);
      return [...withoutOld, nextAccount];
    });
    setActiveAccountId(accountId);
    setDraftJourney(null);
    setAuthError(null);
    return true;
  };

  const login = (name: string, password: string) => {
    const accountId = name.trim().toLowerCase();
    const found = accounts.find((account) => account.id === accountId);

    if (!found || found.password !== password.trim()) {
      setAuthError('Usuario ou senha invalidos.');
      return false;
    }

    setActiveAccountId(found.id);
    setDraftJourney(null);
    setAuthError(null);
    return true;
  };

  const logout = () => {
    setActiveAccountId(null);
    setAuthError(null);
  };

  const updateActiveAccount = (updater: (account: StoredAccount) => StoredAccount) => {
    if (!activeAccountId) {
      return;
    }

    setAccounts((current) =>
      current.map((account) => (account.id === activeAccountId ? updater(account) : account))
    );
  };

  const createMission = (input: CreateMissionInput) => {
    if (!profile) {
      return;
    }

    const assigneeLabel =
      profile.environment === 'empresarial' ? 'Funcionario da equipe' : 'Filho responsavel';

    updateActiveAccount((account) => ({
      ...account,
      missions: [
        buildMission({
          ...input,
          id: `mission-${Date.now()}`,
          state: 'available',
          createdBy: profile.name,
          createdAt: new Date().toISOString(),
          assigneeLabel,
        }),
        ...account.missions,
      ],
    }));
  };

  const submitMissionForApproval = ({
    missionId,
    summary,
    delayReason,
  }: {
    missionId: string;
    summary: string;
    delayReason: string;
  }) => {
    updateActiveAccount((account) => ({
      ...account,
      missions: account.missions.map((mission) =>
        mission.id !== missionId
          ? mission
          : {
              ...mission,
              state: 'awaiting_approval',
              completionRequest: {
                summary,
                delayReason,
                submittedAt: new Date().toISOString(),
              },
              issueReport: undefined,
            }
      ),
    }));
  };

  const reportMissionIssue = ({ missionId, reason }: { missionId: string; reason: string }) => {
    updateActiveAccount((account) => ({
      ...account,
      missions: account.missions.map((mission) =>
        mission.id !== missionId
          ? mission
          : {
              ...mission,
              state: 'reported_issue',
              issueReport: {
                reason,
                submittedAt: new Date().toISOString(),
              },
            }
      ),
    }));
  };

  const approveMissionCompletion = (missionId: string) => {
    updateActiveAccount((account) => ({
      ...account,
      missions: account.missions.map((mission) =>
        mission.id !== missionId
          ? mission
          : {
              ...mission,
              state: 'approved',
              dueLabel: 'Aprovada pelo gestor',
              approvedAt: new Date().toISOString(),
            }
      ),
    }));
  };

  const reopenMission = (missionId: string) => {
    updateActiveAccount((account) => ({
      ...account,
      missions: account.missions.map((mission) =>
        mission.id !== missionId
          ? mission
          : {
              ...mission,
              state: 'available',
              approvedAt: undefined,
              completionRequest: undefined,
              issueReport: undefined,
            }
      ),
    }));
  };

  const value = useMemo(() => {
    const activeMissions = missions.filter((mission) => mission.state === 'available');
    const awaitingApprovalMissions = missions.filter(
      (mission) => mission.state === 'awaiting_approval'
    );
    const approvedMissions = missions.filter((mission) => mission.state === 'approved');
    const issueReportedMissions = missions.filter((mission) => mission.state === 'reported_issue');
    const totalXp = approvedMissions.reduce((acc, mission) => acc + mission.xp, 0);
    const totalLq = approvedMissions.reduce((acc, mission) => acc + mission.lq, 0);
    const completionRate =
      missions.length === 0 ? 0 : Math.round((approvedMissions.length / missions.length) * 100);
    const levelData = calculateLevelProgress(totalXp);

    return {
      isReady,
      hasAccounts: accounts.length > 0,
      draftJourney,
      profile,
      missions,
      activeMissions,
      awaitingApprovalMissions,
      approvedMissions,
      issueReportedMissions,
      totalXp,
      totalLq,
      completionRate,
      currentLevel: levelData.currentLevel,
      currentLevelXp: levelData.currentLevelXp,
      nextLevelXp: levelData.nextLevelXp,
      levelProgressPercent: levelData.levelProgressPercent,
      authError,
      setJourney,
      registerProfile,
      login,
      logout,
      createMission,
      submitMissionForApproval,
      reportMissionIssue,
      approveMissionCompletion,
      reopenMission,
    };
  }, [accounts.length, authError, draftJourney, isReady, missions, profile]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useLifeQuestDemo() {
  const context = useContext(DemoContext);

  if (!context) {
    throw new Error('useLifeQuestDemo must be used within LifeQuestDemoProvider');
  }

  return context;
}
