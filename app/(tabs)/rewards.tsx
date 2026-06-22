import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LifeQuestBackground } from '@/components/lifequest-background';
import { LineChartCard, MiniBarChart, PieChartCard, SegmentedProgressChart } from '@/components/lifequest-charts';
import { LifeQuestMenu } from '@/components/lifequest-menu';
import { creatorRoles, lifeQuestTheme, roleLabels } from '@/constants/lifequest-theme';
import { lifeQuestTypography } from '@/constants/lifequest-typography';
import { useLifeQuestDemo } from '@/contexts/lifequest-demo-context';

const rewardExamples = [
  { type: 'LQ', title: 'Itens visuais', description: 'Moeda virtual para personalizacao do perfil e do app.' },
  { type: 'LQ', title: 'Beneficios internos', description: 'Pequenas trocas simbólicas definidas pelo contexto do projeto.' },
  { type: 'LQS', title: 'Recompensa especial', description: 'Folga, presente, bonus, passeio ou beneficio real validado pelo responsavel.' },
];

export default function RewardsScreen() {
  const {
    approvedMissions,
    currentLevel,
    hasAccounts,
    isReady,
    nextLevelXp,
    profile,
    totalLq,
    totalXp,
    wellness,
  } = useLifeQuestDemo();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!profile?.name) {
      router.replace((hasAccounts ? '/login' : '/') as never);
    }
  }, [hasAccounts, isReady, profile?.name]);

  if (!isReady || !profile?.name) {
    return null;
  }

  const canCreateMissions = creatorRoles.includes(profile.role);
  const lqsPreview = Math.max(0, Math.floor(approvedMissions.length / 3));

  return (
    <LifeQuestBackground>
      <SafeAreaView style={styles.container}>
        <LifeQuestMenu currentRoute="rewards" />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.kicker}>RECOMPENSAS</Text>
          <Text style={styles.title}>Progresso e moedas</Text>
          <Text style={styles.subtitle}>
            {canCreateMissions
              ? `Perfil ${roleLabels[profile.role]}: acompanhe como o sistema distribui valor, engajamento e progresso.`
              : `Perfil ${roleLabels[profile.role]}: veja como suas entregas geram XP, LQ e acesso a recompensas especiais.`}
          </Text>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{totalXp}</Text>
              <Text style={styles.metricLabel}>XP acumulado</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{totalLq}</Text>
              <Text style={styles.metricLabel}>Saldo de LQ</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{lqsPreview}</Text>
              <Text style={styles.metricLabel}>Potencial de LQS</Text>
            </View>
          </View>

          <MiniBarChart
            title="Grafico de progresso"
            subtitle="Comparacao visual entre crescimento, saldo virtual e potencial de recompensa especial."
            data={[
              { label: 'XP', value: totalXp, color: lifeQuestTheme.colors.accent },
              { label: 'LQ', value: totalLq, color: lifeQuestTheme.colors.warning },
              { label: 'LQS', value: lqsPreview, color: lifeQuestTheme.colors.success },
            ]}
          />

          <LineChartCard
            title="Linha de evolucao"
            subtitle="Comparacao visual entre nivel, XP, LQ e potencial de LQS."
            data={[
              { label: 'Nivel', value: currentLevel },
              { label: 'XP', value: totalXp },
              { label: 'LQ', value: totalLq },
              { label: 'LQS', value: lqsPreview },
            ]}
            color={lifeQuestTheme.colors.success}
          />

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Como o sistema recompensa</Text>
            <Text style={styles.sectionText}>
              O XP e calculado automaticamente conforme dificuldade e duracao da missao. O LQ e
              definido na criacao da tarefa. O LQS representa uma recompensa especial ligada a metas
              mais relevantes e depende de aprovacao do responsavel.
            </Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Catalogo demonstrativo</Text>
            {rewardExamples.map((item) => (
              <View key={`${item.type}-${item.title}`} style={styles.rewardRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.type}</Text>
                </View>
                <View style={styles.rewardBody}>
                  <Text style={styles.rewardTitle}>{item.title}</Text>
                  <Text style={styles.rewardDescription}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>

          <SegmentedProgressChart
            title="Composicao das recompensas"
            subtitle="Visao simples do peso de cada tipo de ganho dentro da demonstracao."
            data={[
              {
                label: 'XP acumulado',
                value: Math.max(1, totalXp),
                color: lifeQuestTheme.colors.accent,
              },
              {
                label: 'LQ total',
                value: Math.max(1, totalLq),
                color: lifeQuestTheme.colors.warning,
              },
              {
                label: 'LQS potencial',
                value: Math.max(1, lqsPreview),
                color: lifeQuestTheme.colors.success,
              },
            ]}
          />

          <PieChartCard
            title="Grafico de pizza das recompensas"
            subtitle="Distribuicao do progresso acumulado dentro da demonstracao."
            centerLabel={`${totalLq}`}
            data={[
              {
                label: 'XP',
                value: Math.max(1, totalXp),
                color: lifeQuestTheme.colors.accent,
              },
              {
                label: 'LQ',
                value: Math.max(1, totalLq),
                color: lifeQuestTheme.colors.warning,
              },
              {
                label: 'LQS',
                value: Math.max(1, lqsPreview),
                color: lifeQuestTheme.colors.success,
              },
            ]}
          />

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Resumo do usuario</Text>
            <Text style={styles.sectionText}>
              Nivel atual: {currentLevel}. Proxima meta de nivel: {nextLevelXp} XP. LQ vindo do
              modulo de foco: {wellness?.totalRewardLq ?? 0}. Isso mostra que o app combina
              produtividade, progressao e incentivo visual sem depender de backend complexo.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LifeQuestBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 86, paddingBottom: 42 },
  kicker: { ...lifeQuestTypography.kicker, marginBottom: 10 },
  title: { ...lifeQuestTypography.heroTitle, fontSize: 32, lineHeight: 40, marginBottom: 8, paddingRight: 56 },
  subtitle: { ...lifeQuestTypography.body, marginBottom: 20 },
  metricsGrid: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  metricCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: lifeQuestTheme.colors.cardBorder, borderRadius: 22, borderWidth: 1, flex: 1, padding: 16 },
  metricValue: { color: lifeQuestTheme.colors.text, fontFamily: lifeQuestTheme.fonts.heading, fontSize: 24, marginBottom: 6 },
  metricLabel: { color: lifeQuestTheme.colors.muted, fontFamily: lifeQuestTheme.fonts.body, fontSize: 12, lineHeight: 18 },
  sectionCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: lifeQuestTheme.colors.cardBorder, borderRadius: 24, borderWidth: 1, marginBottom: 18, padding: 18 },
  sectionTitle: { ...lifeQuestTypography.cardTitle, fontSize: 19, marginBottom: 10 },
  sectionText: { ...lifeQuestTypography.body, fontSize: 14, lineHeight: 22 },
  rewardRow: { alignItems: 'flex-start', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 18, flexDirection: 'row', gap: 12, marginTop: 10, padding: 14 },
  badge: { backgroundColor: lifeQuestTheme.colors.accentSoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  badgeText: { color: lifeQuestTheme.colors.accent, fontFamily: lifeQuestTheme.fonts.label, fontSize: 12 },
  rewardBody: { flex: 1 },
  rewardTitle: { ...lifeQuestTypography.bodyStrong, fontSize: 15, marginBottom: 4 },
  rewardDescription: { ...lifeQuestTypography.body, fontSize: 13, lineHeight: 20 },
});
