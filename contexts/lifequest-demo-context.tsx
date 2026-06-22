import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type EnvironmentType = 'residencial' | 'empresarial';
export type RoleType = 'guardiao' | 'heroi' | 'representante' | 'profissionais';
export type MissionKind = 'Diaria' | 'Semanal' | 'Desafio' | 'Contrato';
export type MissionState = 'available' | 'awaiting_approval' | 'approved' | 'reported_issue';
export type MissionDifficulty = 'Facil' | 'Media' | 'Dificil';
export type MissionDuration = 'Curta' | 'Media' | 'Longa';
export type WellnessRank = 'steady' | 'spark' | 'legendary';

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
  environment: EnvironmentType;
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
  assigneeId?: string;
  assigneeName?: string;
  assignedAt?: string;
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
};

type JourneyDraft = Pick<UserProfile, 'environment' | 'role'>;

type CreateMissionInput = Pick<
  Mission,
  'title' | 'description' | 'category' | 'difficulty' | 'duration' | 'dueLabel' | 'lq'
>;

type RegisterPayload = Omit<UserProfile, 'role' | 'environment'> & {
  password: string;
};

export type WellnessSession = {
  playedAt: string;
  score: number;
  rewardLq: number;
  focusGain: number;
  rank: WellnessRank;
  label: string;
};

export type WellnessProgress = {
  sessions: WellnessSession[];
  bestScore: number;
  totalRewardLq: number;
  totalFocusPoints: number;
  currentStreak: number;
  lastPlayedOn?: string;
  lastRewardLq: number;
  lastScore: number;
};

export type WellnessSessionResult = {
  rewardLq: number;
  focusGain: number;
  rank: WellnessRank;
  label: string;
  currentStreak: number;
  bestScore: number;
};

export type ProductivityInsights = {
  score: number;
  approvedCount: number;
  pendingCount: number;
  issueCount: number;
  completionRate: number;
  onTimeRate: number;
  averageClosureHours: number;
  focusIndex: number;
  streak: number;
  reliability: string;
  momentum: string;
};

export type TeamMemberSummary = {
  accountId: string;
  name: string;
  role: RoleType;
  approvedCount: number;
  pendingCount: number;
  focusIndex: number;
  score: number;
  reliability: string;
};

type DemoContextValue = {
  isReady: boolean;
  hasAccounts: boolean;
  draftJourney: JourneyDraft | null;
  profile: UserProfile | null;
  accountId: string | null;
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
  missionError: string | null;
  wellness: WellnessProgress | null;
  personalInsights: ProductivityInsights | null;
  teamInsights: ProductivityInsights | null;
  teamLeaderboard: TeamMemberSummary[];
  setJourney: (environment: EnvironmentType, role: RoleType) => void;
  registerProfile: (payload: RegisterPayload) => boolean;
  login: (name: string, password: string) => boolean;
  logout: () => void;
  refreshMissions: () => Promise<void>;
  createMission: (input: CreateMissionInput) => Promise<void>;
  claimMission: (missionId: string) => Promise<void>;
  recordWellnessSession: (score: number) => WellnessSessionResult | null;
  submitMissionForApproval: (payload: {
    missionId: string;
    summary: string;
    delayReason: string;
  }) => Promise<void>;
  reportMissionIssue: (payload: { missionId: string; reason: string }) => Promise<void>;
  approveMissionCompletion: (missionId: string) => Promise<void>;
  reopenMission: (missionId: string) => Promise<void>;
};

const STORAGE_KEY = 'lifequest-demo-state-v3';
const JSON_SERVER_PORT = 3001;
const bundledDb = require('../db.json') as { missions?: Mission[] };

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

function resolveSharedEnvironment(profile: UserProfile): EnvironmentType {
  if (profile.role === 'representante' || profile.role === 'profissionais') {
    return 'empresarial';
  }

  return 'residencial';
}

function calculateXp(difficulty: MissionDifficulty, duration: MissionDuration) {
  return DIFFICULTY_XP[difficulty] + DURATION_XP[duration];
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

  return {
    currentLevel: level,
    currentLevelXp: remainingXp,
    nextLevelXp: xpGoal,
    levelProgressPercent: Math.min(100, Math.round((remainingXp / xpGoal) * 100)),
  };
}

function getJsonServerBaseUrl() {
  if (typeof window !== 'undefined' && window.location?.hostname) {
    return `http://${window.location.hostname}:${JSON_SERVER_PORT}`;
  }

  const expoGoConfig = (Constants as unknown as { expoGoConfig?: { debuggerHost?: string } })
    .expoGoConfig;
  const debuggerHost = expoGoConfig?.debuggerHost;
  const host = debuggerHost?.split(':')[0] ?? 'localhost';
  return `http://${host}:${JSON_SERVER_PORT}`;
}

function emptyWellness(): WellnessProgress {
  return {
    sessions: [],
    bestScore: 0,
    totalRewardLq: 0,
    totalFocusPoints: 0,
    currentStreak: 0,
    lastRewardLq: 0,
    lastScore: 0,
  };
}

function getDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function diffDays(from: string, to: string) {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  fromDate.setUTCHours(0, 0, 0, 0);
  toDate.setUTCHours(0, 0, 0, 0);
  return Math.round((toDate.getTime() - fromDate.getTime()) / 86400000);
}

function evaluateWellnessScore(score: number) {
  if (score >= 9) {
    return {
      rewardLq: 14,
      focusGain: 22,
      rank: 'legendary' as const,
      label: 'Calmaria lendaria',
    };
  }

  if (score >= 6) {
    return {
      rewardLq: 9,
      focusGain: 14,
      rank: 'spark' as const,
      label: 'Ritmo em alta',
    };
  }

  return {
    rewardLq: 5,
    focusGain: 8,
    rank: 'steady' as const,
    label: 'Respiracao estavel',
  };
}

function getReliability(onTimeRate: number, issueRate: number) {
  if (onTimeRate >= 80 && issueRate <= 10) {
    return 'Alta consistencia';
  }

  if (onTimeRate >= 55 && issueRate <= 25) {
    return 'Boa previsibilidade';
  }

  return 'Precisa de acompanhamento';
}

function getMomentum(score: number, approvedCount: number, streak: number) {
  if (score >= 85 || streak >= 5) {
    return 'Fase acelerada';
  }

  if (approvedCount >= 2) {
    return 'Ritmo em construcao';
  }

  return 'Comeco de jornada';
}

function averageClosureHours(missions: Mission[]) {
  const closed = missions.filter((mission) => mission.approvedAt);

  if (closed.length === 0) {
    return 0;
  }

  const totalMs = closed.reduce((acc, mission) => {
    const approvedAt = new Date(mission.approvedAt as string).getTime();
    const createdAt = new Date(mission.createdAt).getTime();
    return acc + Math.max(0, approvedAt - createdAt);
  }, 0);

  return Math.round((totalMs / closed.length / 3600000) * 10) / 10;
}

function buildInsights(missions: Mission[], wellness: WellnessProgress): ProductivityInsights {
  const approvedCount = missions.filter((mission) => mission.state === 'approved').length;
  const pendingCount = missions.filter(
    (mission) => mission.state === 'available' || mission.state === 'awaiting_approval'
  ).length;
  const issueCount = missions.filter((mission) => mission.state === 'reported_issue').length;
  const completionRate =
    missions.length === 0 ? 0 : Math.round((approvedCount / missions.length) * 100);
  const approved = missions.filter((mission) => mission.state === 'approved');
  const onTimeCount = approved.filter(
    (mission) => !mission.completionRequest?.delayReason?.trim()
  ).length;
  const onTimeRate = approved.length === 0 ? 0 : Math.round((onTimeCount / approved.length) * 100);
  const issueRate = missions.length === 0 ? 0 : Math.round((issueCount / missions.length) * 100);
  const focusIndex =
    wellness.sessions.length === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            wellness.totalFocusPoints / Math.max(1, wellness.sessions.length * 22) * 100
          )
        );
  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        completionRate * 0.45 + onTimeRate * 0.25 + focusIndex * 0.2 + wellness.currentStreak * 2 - issueRate * 0.15
      )
    )
  );

  return {
    score,
    approvedCount,
    pendingCount,
    issueCount,
    completionRate,
    onTimeRate,
    averageClosureHours: averageClosureHours(approved),
    focusIndex,
    streak: wellness.currentStreak,
    reliability: getReliability(onTimeRate, issueRate),
    momentum: getMomentum(score, approvedCount, wellness.currentStreak),
  };
}

type StorageShape = {
  accounts: StoredAccount[];
  wellnessByAccount: Record<string, WellnessProgress>;
};

async function requestJsonServer<T>(path: string, init?: RequestInit): Promise<T> {
  const hasBody = typeof init?.body !== 'undefined';
  const response = await fetch(`${getJsonServerBaseUrl()}${path}`, {
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`json-server respondeu com status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function getBundledMissions(environment: EnvironmentType) {
  return (bundledDb.missions ?? []).filter((mission) => mission.environment === environment);
}

async function runMissionMutation(action: () => Promise<void>, onError: (message: string) => void) {
  try {
    await action();
    onError('');
  } catch {
    onError(
      'Nao foi possivel atualizar as missoes no json-server. Verifique se o servidor esta rodando.'
    );
  }
}

export function LifeQuestDemoProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [missionError, setMissionError] = useState<string | null>(null);
  const [draftJourney, setDraftJourney] = useState<JourneyDraft | null>(null);
  const [accounts, setAccounts] = useState<StoredAccount[]>([]);
  const [wellnessByAccount, setWellnessByAccount] = useState<Record<string, WellnessProgress>>({});
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);

  useEffect(() => {
    const loadState = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);

        if (raw) {
          const parsed = JSON.parse(raw) as Partial<StorageShape>;
          setAccounts(parsed.accounts ?? []);
          setWellnessByAccount(parsed.wellnessByAccount ?? {});
        }
      } catch {
        setAccounts([]);
        setWellnessByAccount({});
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
        wellnessByAccount,
      } satisfies StorageShape)
    );
  }, [accounts, isReady, wellnessByAccount]);

  const activeAccount = useMemo(
    () => accounts.find((account) => account.id === activeAccountId) ?? null,
    [accounts, activeAccountId]
  );

  const profile = activeAccount?.profile ?? null;
  const sharedEnvironment = profile ? resolveSharedEnvironment(profile) : null;

  const refreshMissions = async () => {
    if (!sharedEnvironment) {
      setMissions([]);
      return;
    }

    try {
      const data = await requestJsonServer<Mission[]>('/missions?_sort=createdAt&_order=desc');
      const filtered = data.filter((mission) => mission.environment === sharedEnvironment);
      setMissions(filtered.length > 0 ? filtered : getBundledMissions(sharedEnvironment));
      setMissionError(null);
    } catch {
      setMissions(getBundledMissions(sharedEnvironment));
      setMissionError(
        'Json-server indisponivel. Exibindo a base local de demonstracao com as missoes do projeto.'
      );
    }
  };

  useEffect(() => {
    if (!profile) {
      setMissions([]);
      return;
    }

    void refreshMissions();
    const timer = setInterval(() => {
      void refreshMissions();
    }, 3500);

    return () => clearInterval(timer);
  }, [profile?.environment, profile?.role, activeAccountId]);

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
    };

    setAccounts((current) => {
      const withoutOld = current.filter((account) => account.id !== accountId);
      return [...withoutOld, nextAccount];
    });
    setWellnessByAccount((current) => ({
      ...current,
      [accountId]: current[accountId] ?? emptyWellness(),
    }));
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
    setMissionError(null);
  };

  const recordWellnessSession = (score: number): WellnessSessionResult | null => {
    if (!activeAccountId) {
      return null;
    }

    const evaluation = evaluateWellnessScore(score);
    const now = new Date();
    const dayKey = getDayKey(now);
    const current = wellnessByAccount[activeAccountId] ?? emptyWellness();
    const lastPlayedOn = current.lastPlayedOn;
    const nextStreak =
      !lastPlayedOn
        ? 1
        : lastPlayedOn === dayKey
          ? current.currentStreak
          : diffDays(lastPlayedOn, dayKey) === 1
            ? current.currentStreak + 1
            : 1;
    const session: WellnessSession = {
      playedAt: now.toISOString(),
      score,
      rewardLq: evaluation.rewardLq,
      focusGain: evaluation.focusGain,
      rank: evaluation.rank,
      label: evaluation.label,
    };

    setWellnessByAccount((currentMap) => {
      const previous = currentMap[activeAccountId] ?? emptyWellness();

      return {
        ...currentMap,
        [activeAccountId]: {
          sessions: [session, ...previous.sessions].slice(0, 18),
          bestScore: Math.max(previous.bestScore, score),
          totalRewardLq: previous.totalRewardLq + evaluation.rewardLq,
          totalFocusPoints: previous.totalFocusPoints + evaluation.focusGain,
          currentStreak: nextStreak,
          lastPlayedOn: dayKey,
          lastRewardLq: evaluation.rewardLq,
          lastScore: score,
        },
      };
    });

    return {
      rewardLq: evaluation.rewardLq,
      focusGain: evaluation.focusGain,
      rank: evaluation.rank,
      label: evaluation.label,
      currentStreak: nextStreak,
      bestScore: Math.max(current.bestScore, score),
    };
  };

  const createMission = async (input: CreateMissionInput) => {
    if (!profile || !sharedEnvironment) {
      return;
    }

    const assigneeLabel =
      sharedEnvironment === 'empresarial' ? 'Equipe empresarial' : 'Familia residencial';

    const mission: Mission = {
      id: `${Date.now()}`,
      environment: sharedEnvironment,
      title: input.title,
      description: input.description,
      category: input.category,
      difficulty: input.difficulty,
      duration: input.duration,
      dueLabel: input.dueLabel,
      lq: input.lq,
      xp: calculateXp(input.difficulty, input.duration),
      state: 'available',
      createdBy: profile.name,
      createdAt: new Date().toISOString(),
      assigneeLabel,
    };

    await runMissionMutation(async () => {
      await requestJsonServer<Mission>('/missions', {
        method: 'POST',
        body: JSON.stringify(mission),
      });
      await refreshMissions();
    }, (message) => setMissionError(message || null));
  };

  const claimMission = async (missionId: string) => {
    if (!profile || !activeAccountId) {
      return;
    }

    const mission = missions.find((item) => item.id === missionId);

    if (!mission || mission.assigneeId) {
      return;
    }

    await runMissionMutation(async () => {
      await requestJsonServer<Mission>(`/missions/${missionId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          assigneeId: activeAccountId,
          assigneeName: profile.name,
          assignedAt: new Date().toISOString(),
        }),
      });
      await refreshMissions();
    }, (message) => setMissionError(message || null));
  };

  const submitMissionForApproval = async ({
    missionId,
    summary,
    delayReason,
  }: {
    missionId: string;
    summary: string;
    delayReason: string;
  }) => {
    await runMissionMutation(async () => {
      await requestJsonServer<Mission>(`/missions/${missionId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          state: 'awaiting_approval',
          completionRequest: {
            summary,
            delayReason,
            submittedAt: new Date().toISOString(),
          },
          issueReport: null,
        }),
      });
      await refreshMissions();
    }, (message) => setMissionError(message || null));
  };

  const reportMissionIssue = async ({
    missionId,
    reason,
  }: {
    missionId: string;
    reason: string;
  }) => {
    await runMissionMutation(async () => {
      await requestJsonServer<Mission>(`/missions/${missionId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          state: 'reported_issue',
          issueReport: {
            reason,
            submittedAt: new Date().toISOString(),
          },
        }),
      });
      await refreshMissions();
    }, (message) => setMissionError(message || null));
  };

  const approveMissionCompletion = async (missionId: string) => {
    await runMissionMutation(async () => {
      await requestJsonServer<Mission>(`/missions/${missionId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          state: 'approved',
          dueLabel: 'Aprovada pelo gestor',
          approvedAt: new Date().toISOString(),
        }),
      });
      await refreshMissions();
    }, (message) => setMissionError(message || null));
  };

  const reopenMission = async (missionId: string) => {
    await runMissionMutation(async () => {
      await requestJsonServer<Mission>(`/missions/${missionId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          state: 'available',
          approvedAt: null,
          completionRequest: null,
          issueReport: null,
        }),
      });
      await refreshMissions();
    }, (message) => setMissionError(message || null));
  };

  const value = useMemo(() => {
    const activeMissions = missions.filter((mission) => mission.state === 'available');
    const awaitingApprovalMissions = missions.filter(
      (mission) => mission.state === 'awaiting_approval'
    );
    const approvedMissions = missions.filter((mission) => mission.state === 'approved');
    const issueReportedMissions = missions.filter((mission) => mission.state === 'reported_issue');
    const activeWellness =
      activeAccountId ? wellnessByAccount[activeAccountId] ?? emptyWellness() : null;
    const playerMissions = missions.filter((mission) => mission.assigneeId === activeAccountId);
    const totalXp = approvedMissions
      .filter((mission) => mission.assigneeId === activeAccountId)
      .reduce((acc, mission) => acc + mission.xp, 0);
    const totalLq =
      approvedMissions
        .filter((mission) => mission.assigneeId === activeAccountId)
        .reduce((acc, mission) => acc + mission.lq, 0) + (activeWellness?.totalRewardLq ?? 0);
    const completionRate =
      missions.length === 0 ? 0 : Math.round((approvedMissions.length / missions.length) * 100);
    const levelData = calculateLevelProgress(totalXp);
    const personalInsights =
      activeAccountId && activeWellness ? buildInsights(playerMissions, activeWellness) : null;
    const teamMembers = accounts.filter((account) => {
      if (!sharedEnvironment) {
        return false;
      }

      return resolveSharedEnvironment(account.profile) === sharedEnvironment;
    });
    const teamLeaderboard = teamMembers
      .map((member) => {
        const memberWellness = wellnessByAccount[member.id] ?? emptyWellness();
        const memberMissions = missions.filter((mission) => mission.assigneeId === member.id);
        const insights = buildInsights(memberMissions, memberWellness);

        return {
          accountId: member.id,
          name: member.profile.name,
          role: member.profile.role,
          approvedCount: insights.approvedCount,
          pendingCount: insights.pendingCount,
          focusIndex: insights.focusIndex,
          score: insights.score,
          reliability: insights.reliability,
        };
      })
      .sort((left, right) => right.score - left.score)
      .slice(0, 4);
    const teamWellness: WellnessProgress = {
      sessions: [],
      bestScore: teamMembers.reduce(
        (best, member) => Math.max(best, wellnessByAccount[member.id]?.bestScore ?? 0),
        0
      ),
      totalRewardLq: teamMembers.reduce(
        (acc, member) => acc + (wellnessByAccount[member.id]?.totalRewardLq ?? 0),
        0
      ),
      totalFocusPoints: teamMembers.reduce(
        (acc, member) => acc + (wellnessByAccount[member.id]?.totalFocusPoints ?? 0),
        0
      ),
      currentStreak: teamMembers.length === 0
        ? 0
        : Math.round(
            teamMembers.reduce(
              (acc, member) => acc + (wellnessByAccount[member.id]?.currentStreak ?? 0),
              0
            ) / teamMembers.length
          ),
      lastRewardLq: 0,
      lastScore: 0,
    };
    const teamAssignedMissions = missions.filter((mission) => Boolean(mission.assigneeId));
    const teamInsights = canCreateRole(profile?.role)
      ? buildInsights(teamAssignedMissions, teamWellness)
      : null;

    return {
      isReady,
      hasAccounts: accounts.length > 0,
      draftJourney,
      profile,
      accountId: activeAccountId,
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
      missionError,
      wellness: activeWellness,
      personalInsights,
      teamInsights,
      teamLeaderboard,
      setJourney,
      registerProfile,
      login,
      logout,
      refreshMissions,
      createMission,
      claimMission,
      recordWellnessSession,
      submitMissionForApproval,
      reportMissionIssue,
      approveMissionCompletion,
      reopenMission,
    };
  }, [
    accounts,
    activeAccountId,
    authError,
    draftJourney,
    isReady,
    missionError,
    missions,
    profile,
    wellnessByAccount,
  ]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

function canCreateRole(role?: RoleType | null) {
  return role === 'guardiao' || role === 'representante';
}

export function useLifeQuestDemo() {
  const context = useContext(DemoContext);

  if (!context) {
    throw new Error('useLifeQuestDemo must be used within LifeQuestDemoProvider');
  }

  return context;
}
