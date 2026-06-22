import type {
  EnvironmentType,
  MissionKind,
  ProductivityInsights,
  RoleType,
  WellnessRank,
} from '@/contexts/lifequest-demo-context';

const roleLoreTitles: Record<RoleType, string> = {
  guardiao: 'Guardiao da Jornada',
  heroi: 'Heroi em Evolucao',
  representante: 'Comandante da Operacao',
  profissionais: 'Especialista de Campo',
};

const environmentLoreTitles: Record<EnvironmentType, string> = {
  residencial: 'Santuario de Evolucao',
  empresarial: 'Distrito de Alta Performance',
};

const missionLore: Record<MissionKind, string> = {
  Diaria: 'Missoes diarias sustentam a disciplina e constroem consistencia.',
  Semanal: 'Missoes semanais medem constancia e capacidade de manter ritmo.',
  Desafio: 'Desafios testam coragem, adaptacao e entrega sob pressao.',
  Contrato: 'Contratos registram compromissos importantes com prazo e criterio claro.',
};

const rankLore: Record<WellnessRank, string> = {
  steady: 'Seu foco ficou estavel e pronto para novas entregas.',
  spark: 'Voce entrou em estado de energia e clareza acima da media.',
  legendary: 'Sua sessao foi de elite e deixou a mente pronta para alta performance.',
};

export function getLoreHeader(role: RoleType, environment: EnvironmentType) {
  return {
    roleTitle: roleLoreTitles[role],
    environmentTitle: environmentLoreTitles[environment],
  };
}

export function getMissionLore(kind: MissionKind) {
  return missionLore[kind];
}

export function getRankLore(rank: WellnessRank) {
  return rankLore[rank];
}

export function getPerformanceChapter(
  insights: ProductivityInsights | null,
  canCreateMissions: boolean,
) {
  const score = insights?.score ?? 0;

  if (score >= 85) {
    return canCreateMissions
      ? 'A operacao entrou em fase de dominio: equipe alinhada, foco alto e entregas firmes.'
      : 'Seu capitulo atual e de ascensao: voce esta entregando com consistencia e presenca.';
  }

  if (score >= 60) {
    return canCreateMissions
      ? 'A equipe vive uma fase de consolidacao: boa base, mas ainda com pontos de ajuste.'
      : 'Sua jornada esta em consolidacao: o progresso e real e a proxima virada esta perto.';
  }

  return canCreateMissions
    ? 'O reino precisa de reorganizacao: clareza nas missoes e aprovacoes mais proximas vao ajudar.'
    : 'Seu personagem ainda esta no treino base: pequenas vitorias seguidas vao mudar seu ritmo.';
}

export function getNextMilestone(
  insights: ProductivityInsights | null,
  canCreateMissions: boolean,
) {
  const pending = insights?.pendingCount ?? 0;
  const issues = insights?.issueCount ?? 0;
  const focus = insights?.focusIndex ?? 0;

  if (pending > 2) {
    return canCreateMissions
      ? 'Priorize a fila de aprovacoes para nao travar o fluxo da equipe.'
      : 'Feche as entregas em andamento antes de assumir novas missoes.';
  }

  if (issues > 0) {
    return canCreateMissions
      ? 'Revise justificativas abertas e transforme bloqueios em novos acordos.'
      : 'Use as justificativas como aprendizado para melhorar previsao e comunicacao.';
  }

  if (focus < 55) {
    return canCreateMissions
      ? 'Estimule pausas curtas e uso da Arena para manter a energia da equipe.'
      : 'Uma sessao na Arena pode elevar seu foco antes da proxima entrega.';
  }

  return canCreateMissions
    ? 'A equipe esta pronta para receber desafios mais estrategicos e contratos maiores.'
    : 'Voce ja pode mirar em missoes mais exigentes para acelerar sua evolucao.';
}
