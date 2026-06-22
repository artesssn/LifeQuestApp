import type {
  MissionDifficulty,
  MissionDuration,
  RoleType,
} from '@/contexts/lifequest-demo-context';

export const lifeQuestTheme = {
  colors: {
    background: '#171A20',
    backgroundStrong: '#11141A',
    backgroundPanel: '#1D212A',
    card: '#272C36',
    cardSoft: '#2F3542',
    cardElevated: '#303847',
    cardBorder: 'rgba(255,255,255,0.08)',
    text: '#F5F7FB',
    muted: '#9DA6B5',
    mutedStrong: '#B7C0CF',
    accent: '#5C8DFF',
    accentSoft: 'rgba(92, 141, 255, 0.18)',
    success: '#2DD881',
    successSoft: 'rgba(45, 216, 129, 0.16)',
    warning: '#F4B740',
    warningSoft: 'rgba(244, 183, 64, 0.18)',
    danger: '#FF6B6B',
    line: 'rgba(255,255,255,0.06)',
  },
  gradient: ['#171B23', '#202633', '#171A20'] as const,
  fonts: {
    display: 'Sora_800ExtraBold',
    heading: 'Sora_700Bold',
    title: 'Sora_600SemiBold',
    body: 'Manrope_500Medium',
    bodyStrong: 'Manrope_700Bold',
    label: 'Manrope_600SemiBold',
  },
  radius: {
    sm: 16,
    md: 22,
    lg: 28,
    xl: 34,
  },
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOpacity: 0.18,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    },
  },
};

export const roleLabels = {
  guardiao: 'Responsavel',
  heroi: 'Usuario',
  representante: 'Gestor',
  profissionais: 'Colaborador',
} as const;

export const creatorRoles: RoleType[] = ['guardiao', 'representante'];

export const environmentLabels = {
  residencial: 'Residencial',
  empresarial: 'Empresarial',
} as const;

export const difficultyLabels: Record<MissionDifficulty, string> = {
  Facil: 'Facil',
  Media: 'Media',
  Dificil: 'Dificil',
};

export const durationLabels: Record<MissionDuration, string> = {
  Curta: 'Curta',
  Media: 'Media',
  Longa: 'Longa',
};
