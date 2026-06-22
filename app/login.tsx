import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LifeQuestAuthShell } from '@/components/lifequest-auth-shell';
import { LifeQuestBackground } from '@/components/lifequest-background';
import { lifeQuestTheme } from '@/constants/lifequest-theme';
import { lifeQuestTypography } from '@/constants/lifequest-typography';
import { useLifeQuestDemo } from '@/contexts/lifequest-demo-context';

export default function LoginScreen() {
  const { authError, hasAccounts, isReady, login, profile } = useLifeQuestDemo();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (profile?.name) {
      router.replace('/(tabs)');
      return;
    }

    if (!hasAccounts) {
      router.replace('/');
    }
  }, [hasAccounts, isReady, profile]);

  if (!isReady) {
    return (
      <LifeQuestBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingWrap}>
            <Text style={styles.loadingText}>Carregando LifeQuest...</Text>
          </View>
        </SafeAreaView>
      </LifeQuestBackground>
    );
  }

  return (
    <LifeQuestBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <LifeQuestAuthShell
            kicker="Acesso"
            title="Entre para retomar sua conta"
            subtitle="Use o usuario e a senha cadastrados para continuar sua demonstracao do LifeQuest."
            sideTitle="Fluxo do app"
            sideBody="Depois do login, o perfil acessa o painel, as missoes, as validacoes, as recompensas e o modulo de foco conforme o papel escolhido.">
            <Text style={styles.label}>Usuario</Text>
            <TextInput
              autoCapitalize="words"
              onChangeText={setName}
              placeholder="Seu nome cadastrado"
              placeholderTextColor={lifeQuestTheme.colors.muted}
              style={styles.input}
              testID="login-name-input"
              value={name}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              placeholderTextColor={lifeQuestTheme.colors.muted}
              secureTextEntry
              style={styles.input}
              testID="login-password-input"
              value={password}
            />

            {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

            <Pressable
              onPress={() => {
                const ok = login(name, password);
                if (ok) {
                  router.replace('/(tabs)');
                }
              }}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              testID="login-submit-button">
              <Text style={styles.buttonText}>Entrar no painel</Text>
            </Pressable>

            <Pressable
              onPress={() => router.replace({ pathname: '/', params: { novo: '1' } } as never)}
              style={({ pressed }) => [styles.linkButton, pressed && styles.buttonPressed]}
              testID="login-create-user-button">
              <Text style={styles.linkText}>Criar novo usuario</Text>
            </Pressable>
          </LifeQuestAuthShell>
        </ScrollView>
      </SafeAreaView>
    </LifeQuestBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  label: {
    ...lifeQuestTypography.label,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#DCE5F3',
    borderRadius: lifeQuestTheme.radius.sm,
    color: '#101521',
    fontFamily: lifeQuestTheme.fonts.bodyStrong,
    fontSize: 15,
    marginBottom: 18,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  errorText: {
    color: lifeQuestTheme.colors.danger,
    fontFamily: lifeQuestTheme.fonts.label,
    fontSize: 13,
    marginBottom: 14,
  },
  button: {
    alignItems: 'center',
    backgroundColor: lifeQuestTheme.colors.accent,
    borderRadius: lifeQuestTheme.radius.sm,
    justifyContent: 'center',
    minHeight: 56,
    marginTop: 4,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    color: lifeQuestTheme.colors.text,
    fontFamily: lifeQuestTheme.fonts.heading,
    fontSize: 16,
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 16,
    minHeight: 42,
    justifyContent: 'center',
  },
  linkText: {
    color: lifeQuestTheme.colors.mutedStrong,
    fontFamily: lifeQuestTheme.fonts.label,
    fontSize: 13,
  },
});
