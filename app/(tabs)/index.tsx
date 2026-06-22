import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LifeQuestBackground } from '@/components/lifequest-background';
import { XpProgressCard } from '@/components/xp-progress-card';
import {
  getLoreHeader,
  getNextMilestone,
  getPerformanceChapter,
} from '@/constants/lifequest-lore';
import {
  creatorRoles,
  environmentLabels,
  lifeQuestTheme,
  roleLabels,
} from '@/constants/lifequest-theme';
import { TeamMemberSummary, useLifeQuestDemo } from '@/contexts/lifequest-demo-context';

function MetricPanel({
  value,
  label,
  tone = 'default',
}: {
  value: string | number;
  label: string;
  tone?: 'default' | 'success' | 'warning';
}) {
  return (
    <View
      style={[
        styles.metricCard,
        tone === 'success' && styles.metricCardSuccess,
        tone === 'warning' && styles.metricCardWarning,
      ]}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function ProgressStrip({
  label,
  value,
  note,
  tone = 'accent',
}: {
  label: string;
  value: number;
  note: string;
  tone?: 'accent' | 'success' | 'warning';
}) {
  return (
    <View style={styles.stripBlock}>
      <View style={styles.stripHeader}>
        <Text style={styles.stripLabel}>{label}</Text>
        <Text style={styles.stripValue}>{value}%</Text>
      </View>
      <View style={styles.stripTrack}>
        <View
          style={[
            styles.stripFill,
            tone === 'success' && styles.stripFillSuccess,
            tone === 'warning' && styles.stripFillWarning,
            { width: `${Math.max(6, Math.min(100, value))}%` },
          ]}
        />
      </View>
      <Text style={styles.stripNote}>{note}</Text>
    </View>
  );
}

function LeaderboardRow({ item, index }: { item: TeamMemberSummary; index: number }) {
  return (
    <View style={styles.memberRow}>
      <View style={styles.memberBadge}>
        <Text style={styles.memberBadgeText}>{index + 1}</Text>
      </View>
      <View style={styles.memberBody}>
        <View style={styles.memberTop}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberScore}>{item.score}</Text>
        </View>
        <Text style={styles.memberMeta}>
          {roleLabels[item.role]} • {item.approvedCount} aprovadas • foco {item.focusIndex}%
        </Text>
        <Text style={styles.memberMeta}>{item.reliability}</Text>
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const {
    activeMissions,
    approvedMissions,
    awaitingApprovalMissions,
    currentLevel,
    currentLevelXp,
    hasAccounts,
    issueReportedMissions,
    levelProgressPercent,
    logout,
    nextLevelXp,
    personalInsights,
    profile,
    teamInsights,
    teamLeaderboard,
    totalLq,
    totalXp,
    wellness,
  } = useLifeQuestDemo();

  useEffect(() => {
    if (!profile?.name) {
      router.replace((hasAccounts ? '/login' : '/') as never);
    }
  }, [hasAccounts, profile?.name]);

  if (!profile?.name) {
    return null;
  }

  const canCreateMissions = creatorRoles.includes(profile.role);
  const activeInsights = canCreateMissions ? teamInsights : personalInsights;
  const loreHeader = getLoreHeader(profile.role, profile.environment);
  const currentChapter = getPerformanceChapter(activeInsights, canCreateMissions);
  const nextMilestone = getNextMilestone(activeInsights, canCreateMissions);
  const initials = profile.name
    .split(' ')
    .map((chunk) => chunk[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <LifeQuestBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard} testID="dashboard-hero">
            <View style={styles.heroTopRow}>
              <Text style={styles.kicker}>LIFEQUEST CONTROL</Text>
              <Pressable
                onPress={() => {
                  logout();
                  router.replace('/login' as never);
                }}
                testID="logout-button"
                style={({ pressed }) => [styles.logoutButton, pressed && styles.ctaPressed]}>
                <Text style={styles.logoutText}>Sair</Text>
              </Pressable>
            </View>

            <View style={styles.identityRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.identityBody}>
                <Text style={styles.title} testID="dashboard-title">Ola, {profile.name}</Text>
                <Text style={styles.subtitle}>
                  {environmentLabels[profile.environment]} • {roleLabels[profile.role]}
                </Text>
                <Text style={styles.loreTitle}>
                  {loreHeader.roleTitle} do {loreHeader.environmentTitle}
                </Text>
                <Text style={styles.identityNote}>
                  {canCreateMissions
                    ? 'Painel com produtividade da equipe, aprovacoes e saude operacional.'
                    : 'Painel com evolucao pessoal, foco, consistencia e ganhos de recompensas.'}
                </Text>
              </View>
            </View>

            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <MaterialIcons color={lifeQuestTheme.colors.accent} name="bolt" size={18} />
                <Text style={styles.badgeText}>{totalXp} XP</Text>
              </View>
              <View style={styles.badge}>
                <MaterialIcons color={lifeQuestTheme.colors.warning} name="paid" size={18} />
                <Text style={styles.badgeText}>{totalLq} LQ</Text>
              </View>
              <View style={styles.badge}>
                <MaterialIcons
                  color={lifeQuestTheme.colors.success}
                  name="self-improvement"
                  size={18}
                />
                <Text style={styles.badgeText}>{wellness?.currentStreak ?? 0} dias de foco</Text>
              </View>
            </View>

            {!canCreateMissions ? (
              <XpProgressCard
                currentLevel={currentLevel}
                currentLevelXp={currentLevelXp}
                nextLevelXp={nextLevelXp}
                levelProgressPercent={levelProgressPercent}
                totalXp={totalXp}
              />
            ) : null}
          </View>

          <View style={styles.storyCard} testID="dashboard-story-card">
            <Text style={styles.storyEyebrow}>CAPITULO ATUAL</Text>
            <Text style={styles.storyTitle}>
              {canCreateMissions ? 'Estado do reino operacional' : 'Estado da sua jornada'}
            </Text>
            <Text style={styles.storyBody}>{currentChapter}</Text>
            <View style={styles.storyDivider} />
            <Text style={styles.storyEyebrow}>PROXIMO MARCO</Text>
            <Text style={styles.storyBody}>{nextMilestone}</Text>
          </View>

          {canCreateMissions && teamInsights ? (
            <>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Radar de produtividade</Text>
                <Text style={styles.sectionIntro}>
                  Visao rapida da operacao para identificar ritmo, risco e consistencia da equipe.
                </Text>
                <View style={styles.metricsRow}>
                  <MetricPanel value={teamInsights.score} label="Score da equipe" />
                  <MetricPanel
                    value={teamInsights.approvedCount}
                    label="Entregas aprovadas"
                    tone="success"
                  />
                  <MetricPanel
                    value={teamInsights.pendingCount}
                    label="Fila em andamento"
                    tone="warning"
                  />
                </View>
                <ProgressStrip
                  label="Confiabilidade"
                  value={teamInsights.onTimeRate}
                  note={teamInsights.reliability}
                  tone="success"
                />
                <ProgressStrip
                  label="Ritmo de conclusao"
                  value={teamInsights.completionRate}
                  note={`${teamInsights.issueCount} itens precisam de atencao`}
                />
                <ProgressStrip
                  label="Indice de foco da equipe"
                  value={teamInsights.focusIndex}
                  note={teamInsights.momentum}
                  tone="warning"
                />
              </View>

              <View style={styles.sectionCard}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Ranking da equipe</Text>
                  <Pressable
                    onPress={() => router.push('/explore')}
                    style={({ pressed }) => [styles.linkPill, pressed && styles.ctaPressed]}>
                    <Text style={styles.linkPillText}>Ir para missoes</Text>
                  </Pressable>
                </View>
                {teamLeaderboard.length === 0 ? (
                  <Text style={styles.emptyText}>
                    Ainda nao existe um historico suficiente. Assim que os funcionarios concluirem
                    tarefas, o ranking vai aparecer aqui.
                  </Text>
                ) : (
                  teamLeaderboard.map((item, index) => (
                    <LeaderboardRow key={item.accountId} item={item} index={index} />
                  ))
                )}
              </View>
            </>
          ) : null}

          {!canCreateMissions && personalInsights ? (
            <>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Seu desempenho</Text>
                <Text style={styles.sectionIntro}>
                  Aqui voce acompanha a qualidade das suas entregas e onde pode crescer mais.
                </Text>
                <View style={styles.metricsRow}>
                  <MetricPanel value={personalInsights.score} label="Score pessoal" />
                  <MetricPanel
                    value={personalInsights.approvedCount}
                    label="Missoes aprovadas"
                    tone="success"
                  />
                  <MetricPanel
                    value={personalInsights.pendingCount}
                    label="Pendencias"
                    tone="warning"
                  />
                </View>
                <ProgressStrip
                  label="Pontualidade"
                  value={personalInsights.onTimeRate}
                  note={personalInsights.reliability}
                  tone="success"
                />
                <ProgressStrip
                  label="Progresso geral"
                  value={personalInsights.completionRate}
                  note={personalInsights.momentum}
                />
                <ProgressStrip
                  label="Indice de foco"
                  value={personalInsights.focusIndex}
                  note={`Melhor score do mini game: ${wellness?.bestScore ?? 0}`}
                  tone="warning"
                />
              </View>

              <View style={styles.gridRow}>
                <View style={styles.spotlightCard}>
                  <Text style={styles.spotlightLabel}>Tempo medio</Text>
                  <Text style={styles.spotlightValue}>
                    {personalInsights.averageClosureHours.toFixed(1)}h
                  </Text>
                  <Text style={styles.spotlightNote}>Tempo medio para virar entrega aprovada.</Text>
                </View>
                <View style={styles.spotlightCard}>
                  <Text style={styles.spotlightLabel}>Mini game</Text>
                  <Text style={styles.spotlightValue}>{wellness?.totalRewardLq ?? 0} LQ</Text>
                  <Text style={styles.spotlightNote}>Recompensas extras acumuladas na Arena.</Text>
                </View>
              </View>
            </>
          ) : null}

          <View style={styles.highlightCard}>
            <Text style={styles.sectionTitle}>
              {canCreateMissions ? 'Acoes rapidas do gestor' : 'Seu proximo melhor passo'}
            </Text>
            <Text style={styles.highlightText}>
              {canCreateMissions
                ? 'Use a tela de missoes para criar objetivos mais claros, acompanhar a fila de aprovacao e agir antes de a produtividade cair.'
                : 'Quando sentir desgaste, entre na Arena para ganhar foco e LQ extra. Depois volte para as missoes e mantenha seu score alto.'}
            </Text>
            <View style={styles.ctaRow}>
              <Pressable
                onPress={() => router.push('/explore')}
                style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaPressed]}>
                <Text style={styles.ctaText}>
                  {canCreateMissions ? 'Gerenciar missoes' : 'Abrir missoes'}
                </Text>
                <MaterialIcons color={lifeQuestTheme.colors.text} name="arrow-forward" size={18} />
              </Pressable>
              <Pressable
                onPress={() => router.push('/arena' as never)}
                style={({ pressed }) => [styles.secondaryCta, pressed && styles.ctaPressed]}>
                <Text style={styles.secondaryCtaText}>Abrir arena</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.footerCard}>
            <Text style={styles.footerTitle}>Resumo do momento</Text>
            <Text style={styles.footerText}>
              {canCreateMissions
                ? `${approvedMissions.length} entregas aprovadas, ${awaitingApprovalMissions.length} aguardando avaliacao e ${issueReportedMissions.length} pontos de atencao.`
                : `${activeMissions.length} missoes ativas, ${awaitingApprovalMissions.length} em avaliacao e ${issueReportedMissions.length} justificativas abertas.`}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LifeQuestBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 30,
    borderWidth: 1,
    marginBottom: 18,
    padding: 22,
  },
  heroTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  kicker: {
    color: lifeQuestTheme.colors.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  logoutText: {
    color: lifeQuestTheme.colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  identityRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 18,
  },
  avatarCircle: {
    alignItems: 'center',
    backgroundColor: 'rgba(92,141,255,0.18)',
    borderColor: 'rgba(92,141,255,0.65)',
    borderRadius: 999,
    borderWidth: 1.5,
    height: 70,
    justifyContent: 'center',
    width: 70,
  },
  avatarText: {
    color: lifeQuestTheme.colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  identityBody: {
    flex: 1,
    paddingTop: 2,
  },
  title: {
    color: lifeQuestTheme.colors.text,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: lifeQuestTheme.colors.accent,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  loreTitle: {
    color: lifeQuestTheme.colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    opacity: 0.9,
  },
  identityNote: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: lifeQuestTheme.colors.card,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  badgeText: {
    color: lifeQuestTheme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  storyCard: {
    backgroundColor: '#1D2430',
    borderRadius: 26,
    marginBottom: 18,
    padding: 20,
  },
  storyEyebrow: {
    color: lifeQuestTheme.colors.warning,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  storyTitle: {
    color: lifeQuestTheme.colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },
  storyBody: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  storyDivider: {
    backgroundColor: lifeQuestTheme.colors.line,
    height: 1,
    marginVertical: 16,
  },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 26,
    borderWidth: 1,
    marginBottom: 18,
    padding: 20,
  },
  sectionHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    color: lifeQuestTheme.colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  sectionIntro: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: lifeQuestTheme.colors.cardSoft,
    borderRadius: 22,
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 18,
  },
  metricCardSuccess: {
    backgroundColor: 'rgba(45,216,129,0.12)',
  },
  metricCardWarning: {
    backgroundColor: 'rgba(244,183,64,0.14)',
  },
  metricValue: {
    color: lifeQuestTheme.colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  metricLabel: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  stripBlock: {
    marginBottom: 14,
  },
  stripHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stripLabel: {
    color: lifeQuestTheme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  stripValue: {
    color: lifeQuestTheme.colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  stripTrack: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    height: 10,
    marginBottom: 8,
    overflow: 'hidden',
  },
  stripFill: {
    backgroundColor: lifeQuestTheme.colors.accent,
    borderRadius: 999,
    height: '100%',
  },
  stripFillSuccess: {
    backgroundColor: lifeQuestTheme.colors.success,
  },
  stripFillWarning: {
    backgroundColor: lifeQuestTheme.colors.warning,
  },
  stripNote: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  memberRow: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    padding: 14,
  },
  memberBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(92,141,255,0.18)',
    borderRadius: 999,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  memberBadgeText: {
    color: lifeQuestTheme.colors.accent,
    fontSize: 13,
    fontWeight: '800',
  },
  memberBody: {
    flex: 1,
  },
  memberTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  memberName: {
    color: lifeQuestTheme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  memberScore: {
    color: lifeQuestTheme.colors.success,
    fontSize: 16,
    fontWeight: '800',
  },
  memberMeta: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  spotlightCard: {
    backgroundColor: '#1B2430',
    borderRadius: 22,
    flex: 1,
    padding: 18,
  },
  spotlightLabel: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  spotlightValue: {
    color: lifeQuestTheme.colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  spotlightNote: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  highlightCard: {
    backgroundColor: '#17222D',
    borderRadius: 26,
    marginBottom: 18,
    padding: 20,
  },
  highlightText: {
    color: lifeQuestTheme.colors.text,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 18,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ctaButton: {
    alignItems: 'center',
    backgroundColor: lifeQuestTheme.colors.accent,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  secondaryCta: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    justifyContent: 'center',
    minWidth: 120,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  ctaPressed: {
    opacity: 0.88,
  },
  ctaText: {
    color: lifeQuestTheme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryCtaText: {
    color: lifeQuestTheme.colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  footerCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
  },
  footerTitle: {
    color: lifeQuestTheme.colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  footerText: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  linkPill: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  linkPillText: {
    color: lifeQuestTheme.colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  emptyText: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
});
