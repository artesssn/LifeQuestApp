import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LifeQuestAuthShell } from '@/components/lifequest-auth-shell';
import { LifeQuestBackground } from '@/components/lifequest-background';
import { lifeQuestTheme } from '@/constants/lifequest-theme';
import { lifeQuestTypography } from '@/constants/lifequest-typography';
import { useLifeQuestDemo } from '@/contexts/lifequest-demo-context';

const environments = [
  {
    id: 'empresarial',
    label: 'Ambiente empresarial',
    subtitle: 'Gestao de tarefas, acompanhamento e validacao por lideranca.',
    icon: 'business-center',
  },
  {
    id: 'residencial',
    label: 'Ambiente residencial',
    subtitle: 'Organizacao da rotina em casa com supervisao dos responsaveis.',
    icon: 'home-work',
  },
] as const;

export default function WelcomeScreen() {
  const { novo } = useLocalSearchParams<{ novo?: string }>();
  const { hasAccounts, isReady, profile } = useLifeQuestDemo();
  const shouldCreateNewUser = novo === '1';

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (profile?.name) {
      router.replace('/(tabs)');
      return;
    }

    if (hasAccounts && !shouldCreateNewUser) {
      router.replace('/login' as never);
    }
  }, [hasAccounts, isReady, profile, shouldCreateNewUser]);

  if (!isReady) {
    return (
      <LifeQuestBackground>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingWrap}>
            <Text style={styles.loadingText}>Carregando LifeQuest...</Text>
          </View>
        </SafeAreaView>
      </LifeQuestBackground>
    );
  }

  return (
    <LifeQuestBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <LifeQuestAuthShell
            kicker="LifeQuest Platform"
            title="Gestao de tarefas com gamificacao e validacao real"
            subtitle="Escolha o contexto do sistema para iniciar a demonstracao com uma estrutura mais profissional e clara."
            sideTitle="Resumo do produto"
            sideBody="O LifeQuest organiza tarefas de casa ou da empresa em missoes, com responsabilidade, aprovacao, XP, LQ e indicadores visuais de desempenho.">
            <View style={styles.optionGroup}>
              {environments.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => router.push(`/escolha-classe/${item.id}`)}
                  style={({ pressed }) => [styles.optionCard, pressed && styles.optionCardPressed]}
                  testID={`environment-${item.id}`}>
                  <View style={styles.optionIconWrap}>
                    <MaterialIcons color={lifeQuestTheme.colors.text} name={item.icon} size={24} />
                  </View>
                  <View style={styles.optionBody}>
                    <Text style={styles.optionTitle}>{item.label}</Text>
                    <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
                  </View>
                  <MaterialIcons color={lifeQuestTheme.colors.mutedStrong} name="arrow-forward" size={20} />
                </Pressable>
              ))}
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricChip}>
                <Text style={styles.metricValue}>Missoes</Text>
                <Text style={styles.metricLabel}>fluxo supervisionado</Text>
              </View>
              <View style={styles.metricChip}>
                <Text style={styles.metricValue}>XP + LQ</Text>
                <Text style={styles.metricLabel}>progresso visual</Text>
              </View>
              <View style={styles.metricChip}>
                <Text style={styles.metricValue}>Aprovacao</Text>
                <Text style={styles.metricLabel}>controle do gestor</Text>
              </View>
            </View>
          </LifeQuestAuthShell>
        </ScrollView>
      </SafeAreaView>
    </LifeQuestBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  loadingWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    ...lifeQuestTypography.sectionTitle,
  },
  optionGroup: {
    gap: 14,
  },
  optionCard: {
    alignItems: 'center',
    backgroundColor: lifeQuestTheme.colors.cardElevated,
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: lifeQuestTheme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 94,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.992 }],
  },
  optionIconWrap: {
    alignItems: 'center',
    backgroundColor: lifeQuestTheme.colors.accentSoft,
    borderRadius: 18,
    height: 52,
    justifyContent: 'center',
    marginRight: 14,
    width: 52,
  },
  optionBody: {
    flex: 1,
  },
  optionTitle: {
    ...lifeQuestTypography.cardTitle,
    marginBottom: 4,
  },
  optionSubtitle: {
    ...lifeQuestTypography.body,
    fontSize: 13,
    lineHeight: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  metricChip: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    padding: 14,
  },
  metricValue: {
    color: lifeQuestTheme.colors.text,
    fontFamily: lifeQuestTheme.fonts.heading,
    fontSize: 14,
    marginBottom: 4,
  },
  metricLabel: {
    color: lifeQuestTheme.colors.muted,
    fontFamily: lifeQuestTheme.fonts.body,
    fontSize: 12,
    lineHeight: 18,
  },
});
