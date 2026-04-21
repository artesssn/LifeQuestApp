import type {
  MissionDifficulty,
  MissionDuration,
  RoleType,
} from '@/contexts/lifequest-demo-context';

export const lifeQuestTheme = {
  colors: {
    background: '#171A20',
    backgroundStrong: '#11141A',
    card: '#272C36',
    cardSoft: '#2F3542',
    cardBorder: 'rgba(255,255,255,0.08)',
    text: '#F5F7FB',
    muted: '#9DA6B5',
    accent: '#5C8DFF',
    accentSoft: 'rgba(92, 141, 255, 0.18)',
    success: '#2DD881',
    successSoft: 'rgba(45, 216, 129, 0.16)',
    warning: '#F4B740',
    warningSoft: 'rgba(244, 183, 64, 0.18)',
    danger: '#FF6B6B',
    line: 'rgba(255,255,255,0.06)',
  },
  gradient: ['#1B1E25', '#202430', '#171A20'] as const,
};

export const roleLabels = {
  guardiao: 'Guardião',
  heroi: 'Herói',
  representante: 'Representante',
  profissionais: 'Profissionais',
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
