import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LifeQuestBackground } from '@/components/lifequest-background';
import { LifeQuestMenu } from '@/components/lifequest-menu';
import { environmentLabels, lifeQuestTheme, roleLabels } from '@/constants/lifequest-theme';
import { lifeQuestTypography } from '@/constants/lifequest-typography';
import { useLifeQuestDemo } from '@/contexts/lifequest-demo-context';

export default function ProfileScreen() {
  const {
    approvedMissions,
    completionRate,
    currentLevel,
    hasAccounts,
    isReady,
    logout,
    personalInsights,
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

  return (
    <LifeQuestBackground>
      <SafeAreaView style={styles.container}>
        <LifeQuestMenu
          currentRoute="profile"
          onLogout={() => {
            logout();
            router.replace('/login' as never);
          }}
        />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.kicker}>PERFIL</Text>
          <Text style={styles.title}>Resumo do usuario</Text>
          <Text style={styles.subtitle}>
            Dados de acesso, desempenho e leitura geral do perfil utilizado na demonstracao.
          </Text>

          <View style={styles.heroCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile.name
                  .split(' ')
                  .map((chunk) => chunk[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </Text>
            </View>
            <Text style={styles.userName}>{profile.name}</Text>
            <Text style={styles.userMeta}>
              {roleLabels[profile.role]} • {environmentLabels[profile.environment]}
            </Text>
            <Text style={styles.userDescription}>
              {profile.limitation?.trim()
                ? `Observacao cadastrada: ${profile.limitation}`
                : 'Sem observacao adicional registrada no cadastro.'}
            </Text>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{currentLevel}</Text>
              <Text style={styles.metricLabel}>Nivel atual</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{totalXp}</Text>
              <Text style={styles.metricLabel}>XP total</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{totalLq}</Text>
              <Text style={styles.metricLabel}>LQ total</Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Desempenho registrado</Text>
            <Text style={styles.sectionText}>
              Missoes aprovadas: {approvedMissions.length}. Taxa geral de conclusao: {completionRate}%.
              Foco acumulado: {personalInsights?.focusIndex ?? 0}%. Streak do modulo de foco:{' '}
              {wellness?.currentStreak ?? 0} dias.
            </Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Itens importantes da entrega</Text>
            <Text style={styles.sectionText}>
              Este perfil demonstra login salvo localmente, missoes vinculadas ao ambiente,
              validacao por superior, calculo automatico de XP, ganho de LQ e modulo complementar
              de foco.
            </Text>
          </View>

          <Pressable
            onPress={() => {
              logout();
              router.replace('/login' as never);
            }}
            style={({ pressed }) => [styles.logoutButton, pressed && styles.buttonPressed]}>
            <Text style={styles.logoutText}>Sair do perfil</Text>
          </Pressable>
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
  heroCard: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderColor: lifeQuestTheme.colors.cardBorder, borderRadius: 26, borderWidth: 1, marginBottom: 18, padding: 22 },
  avatar: { alignItems: 'center', backgroundColor: 'rgba(92,141,255,0.18)', borderColor: 'rgba(92,141,255,0.5)', borderRadius: 999, borderWidth: 1, height: 72, justifyContent: 'center', marginBottom: 14, width: 72 },
  avatarText: { color: lifeQuestTheme.colors.text, fontFamily: lifeQuestTheme.fonts.heading, fontSize: 24 },
  userName: { color: lifeQuestTheme.colors.text, fontFamily: lifeQuestTheme.fonts.heading, fontSize: 24, marginBottom: 4 },
  userMeta: { color: lifeQuestTheme.colors.accent, fontFamily: lifeQuestTheme.fonts.label, fontSize: 13, marginBottom: 10 },
  userDescription: { ...lifeQuestTypography.body, fontSize: 14, lineHeight: 22, textAlign: 'center' },
  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  metricCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: lifeQuestTheme.colors.cardBorder, borderRadius: 22, borderWidth: 1, flex: 1, padding: 16 },
  metricValue: { color: lifeQuestTheme.colors.text, fontFamily: lifeQuestTheme.fonts.heading, fontSize: 24, marginBottom: 6 },
  metricLabel: { color: lifeQuestTheme.colors.muted, fontFamily: lifeQuestTheme.fonts.body, fontSize: 12, lineHeight: 18 },
  sectionCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: lifeQuestTheme.colors.cardBorder, borderRadius: 24, borderWidth: 1, marginBottom: 18, padding: 18 },
  sectionTitle: { ...lifeQuestTypography.cardTitle, fontSize: 19, marginBottom: 10 },
  sectionText: { ...lifeQuestTypography.body, fontSize: 14, lineHeight: 22 },
  logoutButton: { alignItems: 'center', backgroundColor: 'rgba(255,107,107,0.14)', borderRadius: 18, justifyContent: 'center', minHeight: 54 },
  logoutText: { color: lifeQuestTheme.colors.text, fontFamily: lifeQuestTheme.fonts.title, fontSize: 15 },
  buttonPressed: { opacity: 0.88 },
});
