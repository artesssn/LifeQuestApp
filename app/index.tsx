import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LifeQuestBackground } from '@/components/lifequest-background';
import { lifeQuestTheme } from '@/constants/lifequest-theme';
import { useLifeQuestDemo } from '@/contexts/lifequest-demo-context';

const ENVIRONMENTS = [
  { id: 'empresarial', label: 'Empresarial', icon: 'business' },
  { id: 'residencial', label: 'Residencial', icon: 'home' },
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
            <Text style={styles.title}>Carregando LifeQuest...</Text>
          </View>
        </SafeAreaView>
      </LifeQuestBackground>
    );
  }

  return (
    <LifeQuestBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.kicker}>Hello, welcome!</Text>
          <Text style={styles.title}>Bem-vindo ao LifeQuest</Text>
          <Text style={styles.subtitle}>Qual ambiente participa da sua jornada?</Text>

          <View style={styles.optionGroup}>
            {ENVIRONMENTS.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push(`/escolha-classe/${item.id}`)}
                style={({ pressed }) => [styles.optionCard, pressed && styles.optionCardPressed]}>
                <MaterialIcons
                  color={lifeQuestTheme.colors.accent}
                  name={item.icon}
                  size={22}
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>O que é o LifeQuest</Text>
            <Text style={styles.infoBody}>
              Um app de gamificação que transforma tarefas do mundo real em missões RPG, com
              progresso, moedas e validação por responsáveis.
            </Text>
          </View>

          <Text style={styles.footer}>Projeto acadêmico com foco em frontend e narrativa do sistema.</Text>
        </ScrollView>
      </SafeAreaView>
    </LifeQuestBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 36,
  },
  loadingWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  kicker: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 15,
    marginBottom: 18,
    textAlign: 'center',
  },
  title: {
    color: lifeQuestTheme.colors.text,
    fontSize: 44,
    fontWeight: '800',
    lineHeight: 52,
    marginBottom: 18,
    textAlign: 'center',
  },
  subtitle: {
    color: lifeQuestTheme.colors.text,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 31,
    marginBottom: 48,
    textAlign: 'center',
  },
  optionGroup: {
    gap: 18,
    marginBottom: 36,
  },
  optionCard: {
    alignItems: 'center',
    backgroundColor: lifeQuestTheme.colors.cardSoft,
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 76,
    paddingHorizontal: 20,
  },
  optionCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    color: lifeQuestTheme.colors.text,
    fontSize: 19,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
  },
  infoTitle: {
    color: lifeQuestTheme.colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  infoBody: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 15,
    lineHeight: 24,
  },
  footer: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 13,
    marginTop: 24,
    textAlign: 'center',
  },
});
