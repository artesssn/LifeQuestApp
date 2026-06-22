import type {
  EnvironmentType,
  MissionKind,
  ProductivityInsights,
  RoleType,
  WellnessRank,
} from '@/contexts/lifequest-demo-context';

const roleTitles: Record<RoleType, string> = {
  guardiao: 'Responsavel residencial',
  heroi: 'Usuario residencial',
  representante: 'Gestor operacional',
  profissionais: 'Colaborador em atividade',
};

const environmentTitles: Record<EnvironmentType, string> = {
  residencial: 'Ambiente familiar',
  empresarial: 'Ambiente empresarial',
};

const missionDescriptions: Record<MissionKind, string> = {
  Diaria: 'Atividades de rotina para manter disciplina, organizacao e frequencia.',
  Semanal: 'Tarefas acompanhadas ao longo da semana para medir constancia.',
  Desafio: 'Entregas mais exigentes para testar foco, iniciativa e compromisso.',
  Contrato: 'Meta formal com prazo, criterio de conclusao e recompensa definida.',
};

const rankDescriptions: Record<WellnessRank, string> = {
  steady: 'Sessao concluida com estabilidade. Bom resultado para manter o foco.',
  spark: 'Sessao acima da media. O usuario mostrou boa velocidade e concentracao.',
  legendary: 'Sessao de alto desempenho. Excelente leitura de foco e resposta.',
};

export function getLoreHeader(role: RoleType, environment: EnvironmentType) {
  return {
    roleTitle: roleTitles[role],
    environmentTitle: environmentTitles[environment],
  };
}

export function getMissionLore(kind: MissionKind) {
  return missionDescriptions[kind];
}

export function getRankLore(rank: WellnessRank) {
  return rankDescriptions[rank];
}

export function getPerformanceChapter(
  insights: ProductivityInsights | null,
  canCreateMissions: boolean,
) {
  const score = insights?.score ?? 0;

  if (score >= 85) {
    return canCreateMissions
      ? 'A equipe esta em alta performance, com boa consistencia de entregas e validacoes.'
      : 'Seu desempenho esta forte, com boa regularidade nas entregas e no foco.';
  }

  if (score >= 60) {
    return canCreateMissions
      ? 'A operacao esta estavel, mas ainda existem pontos de ajuste no fluxo das missoes.'
      : 'Seu desempenho esta em crescimento, com espaco para melhorar previsao e constancia.';
  }

  return canCreateMissions
    ? 'O fluxo de trabalho precisa de mais acompanhamento para ganhar ritmo e previsibilidade.'
    : 'Seu historico ainda esta em formacao. Pequenas entregas aprovadas vao fortalecer seu resultado.';
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
      ? 'Priorize a fila de validacoes para evitar acumulo de tarefas aguardando resposta.'
      : 'Conclua o que ja esta em andamento antes de assumir novas missoes.';
  }

  if (issues > 0) {
    return canCreateMissions
      ? 'Analise as justificativas abertas para reduzir falhas e redefinir prazos com clareza.'
      : 'Revise suas justificativas recentes e ajuste seu planejamento para a proxima entrega.';
  }

  if (focus < 55) {
    return canCreateMissions
      ? 'Incentive pausas curtas e o uso do modulo de foco para preservar a energia da equipe.'
      : 'Use o modulo de foco antes de uma tarefa importante para melhorar atencao e ritmo.';
  }

  return canCreateMissions
    ? 'A equipe esta pronta para receber contratos de missao e metas mais estrategicas.'
    : 'Voce ja pode assumir atividades mais exigentes para acelerar sua evolucao.';
}
