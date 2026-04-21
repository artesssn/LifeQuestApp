import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LifeQuestBackground } from '@/components/lifequest-background';
import { XpProgressCard } from '@/components/xp-progress-card';
import { creatorRoles, environmentLabels, lifeQuestTheme, roleLabels } from '@/constants/lifequest-theme';
import { useLifeQuestDemo } from '@/contexts/lifequest-demo-context';

export default function DashboardScreen() {
  const {
    activeMissions,
    approvedMissions,
    awaitingApprovalMissions,
    completionRate,
    currentLevel,
    currentLevelXp,
    hasAccounts,
    issueReportedMissions,
    levelProgressPercent,
    logout,
    nextLevelXp,
    profile,
    totalLq,
    totalXp,
  } = useLifeQuestDemo();

  if (!profile?.name) {
    router.replace((hasAccounts ? '/login' : '/') as never);
    return null;
  }

  const canCreateMissions = creatorRoles.includes(profile.role);

  return (
    <LifeQuestBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <Text style={styles.kicker}>LIFEQUEST DEMO</Text>
              <Pressable
                onPress={() => {
                  logout();
                  router.replace('/login' as never);
                }}
                style={({ pressed }) => [styles.logoutButton, pressed && styles.ctaPressed]}>
                <Text style={styles.logoutText}>Sair</Text>
              </Pressable>
            </View>
            <Text style={styles.title}>Ola, {profile.name}</Text>
            <Text style={styles.subtitle}>
              Voce esta no ambiente {environmentLabels[profile.environment].toLowerCase()} como{' '}
              {roleLabels[profile.role].toLowerCase()}.
            </Text>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <MaterialIcons color={lifeQuestTheme.colors.accent} name="bolt" size={18} />
                <Text style={styles.badgeText}>{totalXp} XP</Text>
              </View>
              <View style={styles.badge}>
                <MaterialIcons color={lifeQuestTheme.colors.warning} name="paid" size={18} />
                <Text style={styles.badgeText}>{totalLq} LQ</Text>
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

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>
                {canCreateMissions ? awaitingApprovalMissions.length : activeMissions.length}
              </Text>
              <Text style={styles.metricLabel}>
                {canCreateMissions ? 'Aguardando aprovacao' : 'Missoes ativas'}
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>
                {canCreateMissions ? issueReportedMissions.length : awaitingApprovalMissions.length}
              </Text>
              <Text style={styles.metricLabel}>
                {canCreateMissions ? 'Nao concluidas' : 'Em analise'}
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{approvedMissions.length}</Text>
              <Text style={styles.metricLabel}>Aprovadas</Text>
            </View>
          </View>

          <View style={styles.metricCardWide}>
            <Text style={styles.metricValue}>{completionRate}%</Text>
            <Text style={styles.metricLabel}>Taxa geral de progresso validado</Text>
          </View>

          <View style={styles.explainCard}>
            <Text style={styles.sectionTitle}>Como apresentar o sistema</Text>
            <View style={styles.timelineItem}>
              <Text style={styles.timelineNumber}>1</Text>
              <Text style={styles.timelineText}>
                O responsavel cria a missao com prazo, XP e recompensa.
              </Text>
            </View>
            <View style={styles.timelineItem}>
              <Text style={styles.timelineNumber}>2</Text>
              <Text style={styles.timelineText}>
                O usuario executa a tarefa, informa o que foi feito e justifica atraso ou nao
                conclusao.
              </Text>
            </View>
            <View style={styles.timelineItem}>
              <Text style={styles.timelineNumber}>3</Text>
              <Text style={styles.timelineText}>
                O gestor aprova a entrega e so depois a missao conta como concluida no sistema.
              </Text>
            </View>
          </View>

          <View style={styles.highlightCard}>
            <Text style={styles.sectionTitle}>Funcionalidade principal da demo</Text>
            <Text style={styles.highlightText}>
              {canCreateMissions
                ? 'Neste perfil voce demonstra criacao de missao, fila de aprovacao e a definicao automatica de XP e LQ pelo sistema.'
                : 'Neste perfil voce demonstra recebimento da missao, ganho de XP e LQ por conclusao aprovada e registro dos motivos que ajudam o superior a avaliar a entrega.'}
            </Text>
            <Pressable
              onPress={() => router.push('/explore')}
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaPressed]}>
              <Text style={styles.ctaText}>
                {canCreateMissions ? 'Gerenciar missoes' : 'Ver minhas missoes'}
              </Text>
              <MaterialIcons color={lifeQuestTheme.colors.text} name="arrow-forward" size={18} />
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LifeQuestBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 36 },
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 18,
    padding: 22,
  },
  heroTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  kicker: { color: lifeQuestTheme.colors.accent, fontSize: 12, fontWeight: '800', marginBottom: 10 },
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
  title: { color: lifeQuestTheme.colors.text, fontSize: 32, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: lifeQuestTheme.colors.muted, fontSize: 15, lineHeight: 23, marginBottom: 18 },
  badgeRow: { flexDirection: 'row', gap: 12 },
  badge: {
    alignItems: 'center',
    backgroundColor: lifeQuestTheme.colors.card,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  badgeText: { color: lifeQuestTheme.colors.text, fontSize: 14, fontWeight: '700' },
  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  metricCard: {
    backgroundColor: lifeQuestTheme.colors.cardSoft,
    borderRadius: 22,
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 18,
  },
  metricCardWide: {
    backgroundColor: lifeQuestTheme.colors.cardSoft,
    borderRadius: 22,
    marginBottom: 18,
    paddingHorizontal: 14,
    paddingVertical: 18,
  },
  metricValue: { color: lifeQuestTheme.colors.text, fontSize: 24, fontWeight: '800', marginBottom: 6 },
  metricLabel: { color: lifeQuestTheme.colors.muted, fontSize: 12, lineHeight: 18 },
  explainCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 18,
    padding: 20,
  },
  sectionTitle: { color: lifeQuestTheme.colors.text, fontSize: 18, fontWeight: '800', marginBottom: 14 },
  timelineItem: { alignItems: 'flex-start', flexDirection: 'row', gap: 12, marginBottom: 12 },
  timelineNumber: {
    backgroundColor: lifeQuestTheme.colors.accentSoft,
    borderRadius: 999,
    color: lifeQuestTheme.colors.accent,
    fontSize: 13,
    fontWeight: '800',
    minWidth: 26,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 6,
    textAlign: 'center',
  },
  timelineText: { color: lifeQuestTheme.colors.muted, flex: 1, fontSize: 14, lineHeight: 22 },
  highlightCard: { backgroundColor: '#17222D', borderRadius: 24, padding: 20 },
  highlightText: { color: lifeQuestTheme.colors.text, fontSize: 15, lineHeight: 24, marginBottom: 18 },
  ctaButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: lifeQuestTheme.colors.accent,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  ctaPressed: { opacity: 0.88 },
  ctaText: { color: lifeQuestTheme.colors.text, fontSize: 15, fontWeight: '800' },
});
