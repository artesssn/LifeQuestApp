import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LifeQuestBackground } from '@/components/lifequest-background';
import { lifeQuestTheme } from '@/constants/lifequest-theme';
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
            <Text style={styles.title}>Carregando LifeQuest...</Text>
          </View>
        </SafeAreaView>
      </LifeQuestBackground>
    );
  }

  return (
    <LifeQuestBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.kicker}>ACESSO</Text>
          <Text style={styles.title}>Entre com seu usuario</Text>
          <Text style={styles.subtitle}>
            Use o nome e a senha cadastrados para voltar ao seu perfil salvo.
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>Usuario</Text>
            <TextInput
              autoCapitalize="words"
              onChangeText={setName}
              placeholder="Seu nome cadastrado"
              placeholderTextColor={lifeQuestTheme.colors.muted}
              style={styles.input}
              value={name}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              placeholderTextColor={lifeQuestTheme.colors.muted}
              secureTextEntry
              style={styles.input}
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
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
              <Text style={styles.buttonText}>Entrar</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => router.replace({ pathname: '/', params: { novo: '1' } } as never)}
            style={({ pressed }) => [styles.linkButton, pressed && styles.buttonPressed]}>
            <Text style={styles.linkText}>Criar novo usuario</Text>
          </Pressable>
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
    color: lifeQuestTheme.colors.accent,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    color: lifeQuestTheme.colors.text,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 42,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 28,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  label: {
    color: lifeQuestTheme.colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  input: {
    backgroundColor: lifeQuestTheme.colors.card,
    borderRadius: 18,
    color: lifeQuestTheme.colors.text,
    fontSize: 15,
    marginBottom: 18,
    minHeight: 54,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  errorText: {
    color: lifeQuestTheme.colors.danger,
    fontSize: 13,
    marginBottom: 14,
  },
  button: {
    alignItems: 'center',
    backgroundColor: lifeQuestTheme.colors.accent,
    borderRadius: 18,
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonText: {
    color: lifeQuestTheme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 18,
  },
  linkText: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
});
