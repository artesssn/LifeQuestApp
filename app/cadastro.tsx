import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LifeQuestAuthShell } from '@/components/lifequest-auth-shell';
import { LifeQuestBackground } from '@/components/lifequest-background';
import { environmentLabels, lifeQuestTheme, roleLabels } from '@/constants/lifequest-theme';
import { lifeQuestTypography } from '@/constants/lifequest-typography';
import { useLifeQuestDemo } from '@/contexts/lifequest-demo-context';

const companions = [
  {
    id: 'fox',
    name: 'Kael',
    title: 'Acompanha metas e progresso',
    icon: 'pets',
  },
  {
    id: 'owl',
    name: 'Lyra',
    title: 'Observa foco e consistencia',
    icon: 'visibility',
  },
] as const;

export default function CadastroScreen() {
  const { authError, draftJourney, registerProfile } = useLifeQuestDemo();
  const [name, setName] = useState('');
  const [limitation, setLimitation] = useState('');
  const [password, setPassword] = useState('');
  const [companionId, setCompanionId] = useState<'fox' | 'owl'>('fox');

  const disabled = useMemo(
    () => name.trim().length < 3 || password.trim().length < 4 || !draftJourney,
    [draftJourney, name, password]
  );

  useEffect(() => {
    if (!draftJourney) {
      router.replace('/');
    }
  }, [draftJourney]);

  if (!draftJourney) {
    return null;
  }

  return (
    <LifeQuestBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <LifeQuestAuthShell
            kicker="Cadastro"
            title="Configure a conta da demonstracao"
            subtitle={`Ambiente ${environmentLabels[draftJourney.environment]} • Perfil ${roleLabels[draftJourney.role]}`}
            sideTitle="O que esta sendo configurado"
            sideBody="Esse cadastro salva nome, senha, contexto e avatar de apoio para que o usuario volte ao mesmo ponto da demonstracao depois.">
            <View style={styles.avatarCard}>
              <Text style={styles.blockTitle}>Escolha um perfil de apoio</Text>
              <Text style={styles.blockBody}>
                Esse item reforca a proposta visual do app sem tirar o foco da parte profissional.
              </Text>

              <View style={styles.avatarGrid}>
                {companions.map((companion) => {
                  const selected = companion.id === companionId;

                  return (
                    <Pressable
                      key={companion.id}
                      onPress={() => setCompanionId(companion.id)}
                      style={({ pressed }) => [
                        styles.avatarOption,
                        selected && styles.avatarOptionSelected,
                        pressed && styles.optionPressed,
                      ]}
                      testID={`companion-${companion.id}`}>
                      <View style={[styles.avatarIconWrap, selected && styles.avatarIconWrapSelected]}>
                        <MaterialIcons
                          color={lifeQuestTheme.colors.text}
                          name={companion.icon}
                          size={24}
                        />
                      </View>
                      <Text style={styles.avatarName}>{companion.name}</Text>
                      <Text style={styles.avatarRole}>{companion.title}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Text style={styles.label}>Nome</Text>
            <TextInput
              onChangeText={setName}
              placeholder="Digite seu nome para a demo"
              placeholderTextColor={lifeQuestTheme.colors.muted}
              style={styles.input}
              testID="register-name-input"
              value={name}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              onChangeText={setPassword}
              placeholder="Crie uma senha"
              placeholderTextColor={lifeQuestTheme.colors.muted}
              secureTextEntry
              style={styles.input}
              testID="register-password-input"
              value={password}
            />

            <Text style={styles.label}>Observacao adicional</Text>
            <TextInput
              multiline
              numberOfLines={3}
              onChangeText={setLimitation}
              placeholder="Opcional"
              placeholderTextColor={lifeQuestTheme.colors.muted}
              style={[styles.input, styles.inputMultiline]}
              testID="register-limitation-input"
              textAlignVertical="top"
              value={limitation}
            />

            {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

            <Pressable
              disabled={disabled}
              onPress={() => {
                const ok = registerProfile({
                  name: name.trim(),
                  limitation: limitation.trim(),
                  companionId,
                  password,
                });
                if (ok) {
                  router.replace('/(tabs)');
                }
              }}
              style={({ pressed }) => [
                styles.submitButton,
                disabled && styles.submitButtonDisabled,
                pressed && !disabled && styles.optionPressed,
              ]}
              testID="register-submit-button">
              <Text style={styles.submitButtonText}>Finalizar cadastro</Text>
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
  avatarCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: lifeQuestTheme.radius.md,
    borderWidth: 1,
    marginBottom: 18,
    padding: 16,
  },
  blockTitle: {
    ...lifeQuestTypography.cardTitle,
    marginBottom: 6,
  },
  blockBody: {
    ...lifeQuestTypography.body,
    marginBottom: 14,
  },
  avatarGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  avatarOption: {
    backgroundColor: lifeQuestTheme.colors.cardElevated,
    borderColor: 'transparent',
    borderRadius: lifeQuestTheme.radius.md,
    borderWidth: 1,
    flex: 1,
    padding: 14,
  },
  avatarOptionSelected: {
    borderColor: lifeQuestTheme.colors.accent,
    backgroundColor: 'rgba(92,141,255,0.15)',
  },
  avatarIconWrap: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    height: 48,
    justifyContent: 'center',
    marginBottom: 12,
    width: 48,
  },
  avatarIconWrapSelected: {
    backgroundColor: lifeQuestTheme.colors.accentSoft,
  },
  avatarName: {
    color: lifeQuestTheme.colors.text,
    fontFamily: lifeQuestTheme.fonts.title,
    fontSize: 16,
    marginBottom: 4,
  },
  avatarRole: {
    color: lifeQuestTheme.colors.muted,
    fontFamily: lifeQuestTheme.fonts.body,
    fontSize: 12,
    lineHeight: 18,
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
  inputMultiline: {
    minHeight: 92,
  },
  errorText: {
    color: lifeQuestTheme.colors.danger,
    fontFamily: lifeQuestTheme.fonts.label,
    fontSize: 13,
    marginBottom: 14,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: lifeQuestTheme.colors.accent,
    borderRadius: lifeQuestTheme.radius.sm,
    justifyContent: 'center',
    minHeight: 56,
    marginTop: 4,
  },
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitButtonText: {
    color: lifeQuestTheme.colors.text,
    fontFamily: lifeQuestTheme.fonts.heading,
    fontSize: 16,
  },
  optionPressed: {
    opacity: 0.9,
  },
});
