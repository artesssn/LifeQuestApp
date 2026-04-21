import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LifeQuestBackground } from '@/components/lifequest-background';
import { environmentLabels, lifeQuestTheme, roleLabels } from '@/constants/lifequest-theme';
import { useLifeQuestDemo } from '@/contexts/lifequest-demo-context';

const COMPANIONS = [
  {
    id: 'fox',
    emoji: '🦊',
    name: 'Kael',
    title: 'Raposa estratégica',
    icon: 'auto-awesome',
    accent: '#F08A31',
  },
  {
    id: 'owl',
    emoji: '🦉',
    name: 'Lyra',
    title: 'Coruja observadora',
    icon: 'nightlight-round',
    accent: '#6E7DFF',
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

  if (!draftJourney) {
    router.replace('/');
    return null;
  }

  return (
    <LifeQuestBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.kicker}>Cadastro inicial</Text>
          <Text style={styles.title}>Agora vamos parametrizar sua conta</Text>
          <Text style={styles.subtitle}>
            Ambiente {environmentLabels[draftJourney.environment]} • classe {roleLabels[draftJourney.role]}
          </Text>

          <View style={styles.avatarCard}>
            <Text style={styles.avatarTitle}>Escolha um companheiro</Text>
            <Text style={styles.avatarSubtitle}>
              Seu companheiro representa a jornada do jogador dentro do LifeQuest.
            </Text>
            <View style={styles.avatarGrid}>
              {COMPANIONS.map((companion) => {
                const selected = companion.id === companionId;

                return (
                  <Pressable
                    key={companion.id}
                    onPress={() => setCompanionId(companion.id)}
                    style={({ pressed }) => [
                      styles.avatarOption,
                      selected && styles.avatarOptionSelected,
                      pressed && styles.avatarOptionPressed,
                    ]}>
                    <View
                      style={[
                        styles.avatarIllustration,
                        { backgroundColor: `${companion.accent}22` },
                      ]}>
                      <Text style={styles.avatarEmoji}>{companion.emoji}</Text>
                      <View
                        style={[
                          styles.avatarIconBadge,
                          { backgroundColor: companion.accent },
                        ]}>
                        <MaterialIcons
                          color={lifeQuestTheme.colors.text}
                          name={companion.icon}
                          size={16}
                        />
                      </View>
                    </View>
                    <Text style={styles.avatarName}>{companion.name}</Text>
                    <Text style={styles.avatarRole}>{companion.title}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.inputLabel}>Seu nome</Text>
            <TextInput
              onChangeText={setName}
              placeholder="Digite seu nome para a demo"
              placeholderTextColor={lifeQuestTheme.colors.muted}
              style={styles.input}
              value={name}
            />

            <Text style={styles.inputLabel}>Senha</Text>
            <TextInput
              onChangeText={setPassword}
              placeholder="Crie uma senha"
              placeholderTextColor={lifeQuestTheme.colors.muted}
              secureTextEntry
              style={styles.input}
              value={password}
            />

            <Text style={styles.inputLabel}>Limitação física ou observação</Text>
            <TextInput
              multiline
              numberOfLines={3}
              onChangeText={setLimitation}
              placeholder="Opcional"
              placeholderTextColor={lifeQuestTheme.colors.muted}
              style={[styles.input, styles.inputMultiline]}
              textAlignVertical="top"
              value={limitation}
            />

            {authError ? <Text style={styles.errorText}>{authError}</Text> : null}
          </View>

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
              pressed && !disabled && styles.submitButtonPressed,
            ]}>
            <MaterialIcons color={lifeQuestTheme.colors.text} name="check-circle" size={22} />
            <Text style={styles.submitButtonText}>Entrar na demonstração</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </LifeQuestBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 36,
  },
  kicker: {
    color: lifeQuestTheme.colors.accent,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  title: {
    color: lifeQuestTheme.colors.text,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 42,
    marginBottom: 8,
  },
  subtitle: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 28,
  },
  avatarCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 18,
    padding: 20,
  },
  avatarTitle: {
    color: lifeQuestTheme.colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  avatarSubtitle: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  avatarGrid: {
    flexDirection: 'row',
    gap: 14,
  },
  avatarOption: {
    alignItems: 'center',
    backgroundColor: lifeQuestTheme.colors.card,
    borderColor: 'transparent',
    borderRadius: 22,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 18,
  },
  avatarOptionSelected: {
    backgroundColor: lifeQuestTheme.colors.accentSoft,
    borderColor: lifeQuestTheme.colors.accent,
  },
  avatarOptionPressed: {
    opacity: 0.88,
  },
  avatarIllustration: {
    alignItems: 'center',
    borderRadius: 22,
    height: 92,
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
    width: '100%',
  },
  avatarEmoji: {
    fontSize: 42,
  },
  avatarIconBadge: {
    alignItems: 'center',
    borderRadius: 999,
    bottom: 10,
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    width: 30,
  },
  avatarName: {
    color: lifeQuestTheme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  avatarRole: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 24,
    padding: 20,
  },
  inputLabel: {
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
  inputMultiline: {
    marginBottom: 0,
    minHeight: 98,
  },
  errorText: {
    color: lifeQuestTheme.colors.danger,
    fontSize: 13,
    marginTop: 12,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#0D6B08',
    borderRadius: 22,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    minHeight: 60,
  },
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitButtonPressed: {
    opacity: 0.92,
  },
  submitButtonText: {
    color: lifeQuestTheme.colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
});
