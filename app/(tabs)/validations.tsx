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

export default function ValidationsScreen() {
  const {
    approvedMissions,
    awaitingApprovalMissions,
    hasAccounts,
    isReady,
    issueReportedMissions,
    missions,
    profile,
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
  const openValidationCount = awaitingApprovalMissions.length + issueReportedMissions.length;

  return (
    <LifeQuestBackground>
      <SafeAreaView style={styles.container}>
        <LifeQuestMenu currentRoute="validations" />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.kicker}>VALIDACOES</Text>
          <Text style={styles.title}>Controle de aprovacoes</Text>
          <Text style={styles.subtitle}>
            {canCreateMissions
              ? `Perfil ${roleLabels[profile.role]}: acompanhe aprovacoes pendentes, justificativas e entregas concluidas.`
              : `Perfil ${roleLabels[profile.role]}: acompanhe o status das entregas enviadas e das justificativas abertas.`}
          </Text>

          <View style={styles.summaryRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{awaitingApprovalMissions.length}</Text>
              <Text style={styles.metricLabel}>Aguardando aprovacao</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{issueReportedMissions.length}</Text>
              <Text style={styles.metricLabel}>Com justificativa</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{approvedMissions.length}</Text>
              <Text style={styles.metricLabel}>Aprovadas</Text>
            </View>
          </View>

          <MiniBarChart
            title="Grafico de validacoes"
            subtitle="Comparacao direta entre o que esta aguardando, o que foi justificado e o que ja foi aprovado."
            data={[
              {
                label: 'Aguardando',
                value: awaitingApprovalMissions.length,
                color: lifeQuestTheme.colors.warning,
              },
              {
                label: 'Justificadas',
                value: issueReportedMissions.length,
                color: lifeQuestTheme.colors.danger,
              },
              {
                label: 'Aprovadas',
                value: approvedMissions.length,
                color: lifeQuestTheme.colors.success,
              },
            ]}
          />

          <LineChartCard
            title="Linha de status"
            subtitle="Comparacao sequencial entre aprovacoes, justificativas e fila pendente."
            data={[
              { label: 'Pend', value: awaitingApprovalMissions.length },
              { label: 'Just', value: issueReportedMissions.length },
              { label: 'Aprov', value: approvedMissions.length },
            ]}
            color={lifeQuestTheme.colors.warning}
          />

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Leitura do fluxo</Text>
            <Text style={styles.sectionText}>
              {canCreateMissions
                ? `Hoje existem ${openValidationCount} itens que dependem de sua decisao direta. Isso ajuda a demonstrar o papel do gestor na validacao e no controle do sistema.`
                : `Voce possui ${awaitingApprovalMissions.length} entrega${awaitingApprovalMissions.length === 1 ? '' : 's'} em analise e ${issueReportedMissions.length} justificativa${issueReportedMissions.length === 1 ? '' : 's'} registradas no sistema.`}
            </Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Fila atual</Text>
            {missions.length === 0 ? (
              <Text style={styles.emptyText}>
                Ainda nao existem registros suficientes para gerar a fila de validacoes.
              </Text>
            ) : (
              <>
                {awaitingApprovalMissions.map((mission) => (
                  <View key={mission.id} style={styles.rowCard}>
                    <Text style={styles.rowTitle}>{mission.title}</Text>
                    <Text style={styles.rowMeta}>
                      Status: aguardando aprovacao • Responsavel: {mission.assigneeName || 'Nao definido'}
                    </Text>
                    <Text style={styles.rowBody}>
                      {mission.completionRequest?.summary || 'Entrega aguardando resumo do usuario.'}
                    </Text>
                  </View>
                ))}

                {issueReportedMissions.map((mission) => (
                  <View key={mission.id} style={styles.rowCard}>
                    <Text style={styles.rowTitle}>{mission.title}</Text>
                    <Text style={styles.rowMeta}>
                      Status: justificativa enviada • Responsavel: {mission.assigneeName || 'Nao definido'}
                    </Text>
                    <Text style={styles.rowBody}>
                      {mission.issueReport?.reason || 'Motivo de nao conclusao ainda nao informado.'}
                    </Text>
                  </View>
                ))}

                {awaitingApprovalMissions.length === 0 && issueReportedMissions.length === 0 ? (
                  <Text style={styles.emptyText}>
                    Nenhum item pendente. O fluxo de aprovacoes esta limpo neste momento.
                  </Text>
                ) : null}
              </>
            )}
          </View>

          <SegmentedProgressChart
            title="Distribuicao do controle"
            subtitle="Mostra visualmente onde esta a maior concentracao do trabalho de validacao."
            data={[
              {
                label: 'Aguardando aprovacao',
                value: awaitingApprovalMissions.length,
                color: lifeQuestTheme.colors.warning,
              },
              {
                label: 'Com justificativa',
                value: issueReportedMissions.length,
                color: lifeQuestTheme.colors.danger,
              },
              {
                label: 'Aprovadas',
                value: approvedMissions.length,
                color: lifeQuestTheme.colors.success,
              },
            ]}
          />

          <PieChartCard
            title="Grafico de pizza das validacoes"
            subtitle="Distribuicao visual do volume por situacao."
            centerLabel={`${awaitingApprovalMissions.length + issueReportedMissions.length + approvedMissions.length}`}
            data={[
              {
                label: 'Aguardando',
                value: awaitingApprovalMissions.length,
                color: lifeQuestTheme.colors.warning,
              },
              {
                label: 'Justificadas',
                value: issueReportedMissions.length,
                color: lifeQuestTheme.colors.danger,
              },
              {
                label: 'Aprovadas',
                value: approvedMissions.length,
                color: lifeQuestTheme.colors.success,
              },
            ]}
          />
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
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  metricCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: lifeQuestTheme.colors.cardBorder, borderRadius: 22, borderWidth: 1, flex: 1, padding: 16 },
  metricValue: { color: lifeQuestTheme.colors.text, fontFamily: lifeQuestTheme.fonts.heading, fontSize: 24, marginBottom: 6 },
  metricLabel: { color: lifeQuestTheme.colors.muted, fontFamily: lifeQuestTheme.fonts.body, fontSize: 12, lineHeight: 18 },
  sectionCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: lifeQuestTheme.colors.cardBorder, borderRadius: 24, borderWidth: 1, marginBottom: 18, padding: 18 },
  sectionTitle: { ...lifeQuestTypography.cardTitle, fontSize: 19, marginBottom: 10 },
  sectionText: { ...lifeQuestTypography.body, fontSize: 14, lineHeight: 22 },
  rowCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 18, marginTop: 10, padding: 14 },
  rowTitle: { ...lifeQuestTypography.bodyStrong, fontSize: 16, marginBottom: 6 },
  rowMeta: { color: lifeQuestTheme.colors.accent, fontFamily: lifeQuestTheme.fonts.label, fontSize: 12, marginBottom: 8 },
  rowBody: { ...lifeQuestTypography.body, fontSize: 13, lineHeight: 20 },
  emptyText: { ...lifeQuestTypography.body, fontSize: 14, lineHeight: 22 },
});
