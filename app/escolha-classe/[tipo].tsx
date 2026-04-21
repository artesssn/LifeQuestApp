import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LifeQuestBackground } from '@/components/lifequest-background';
import { environmentLabels, lifeQuestTheme, roleLabels } from '@/constants/lifequest-theme';
import { EnvironmentType, RoleType, useLifeQuestDemo } from '@/contexts/lifequest-demo-context';

const OPTIONS_RESIDENTIAL = [
  {
    id: 'guardiao',
    title: 'Guardião',
    subtitle: 'Pais ou responsáveis',
    icon: 'shield',
  },
  {
    id: 'heroi',
    title: 'Herói',
    subtitle: 'Cumprir tarefas',
    icon: 'person',
  },
] satisfies { id: RoleType; title: string; subtitle: string; icon: keyof typeof MaterialIcons.glyphMap }[];

const OPTIONS_BUSINESS = [
  {
    id: 'representante',
    title: 'Representante',
    subtitle: 'Gestor ou administrador',
    icon: 'badge',
  },
  {
    id: 'profissionais',
    title: 'Profissionais',
    subtitle: 'Cumprir tarefas',
    icon: 'engineering',
  },
] satisfies { id: RoleType; title: string; subtitle: string; icon: keyof typeof MaterialIcons.glyphMap }[];

export default function EscolhaClasseScreen() {
  const { tipo } = useLocalSearchParams<{ tipo: EnvironmentType }>();
  const router = useRouter();
  const { setJourney } = useLifeQuestDemo();

  if (!tipo || (tipo !== 'residencial' && tipo !== 'empresarial')) {
    router.replace('/');
    return null;
  }

  const options = tipo === 'residencial' ? OPTIONS_RESIDENTIAL : OPTIONS_BUSINESS;

  return (
    <LifeQuestBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>class</Text>
          <Text style={styles.title}>Escolha de classe</Text>
          <Text style={styles.subtitle}>
            Você selecionou o ambiente {environmentLabels[tipo].toLowerCase()}. Agora escolha o seu
            papel dentro do sistema.
          </Text>

          <View style={styles.list}>
            {options.map((option) => (
              <Pressable
                key={option.id}
                onPress={() => {
                  setJourney(tipo, option.id);
                  router.push('/cadastro' as never);
                }}
                style={({ pressed }) => [styles.classButton, pressed && styles.classButtonPressed]}>
                <MaterialIcons
                  color={lifeQuestTheme.colors.accent}
                  name={option.icon}
                  size={24}
                  style={styles.classIcon}
                />
                <View style={styles.classText}>
                  <Text style={styles.classTitle}>{option.title}</Text>
                  <Text style={styles.classSubtitle}>{option.subtitle}</Text>
                </View>
                <MaterialIcons color={lifeQuestTheme.colors.muted} name="chevron-right" size={22} />
              </Pressable>
            ))}
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Como explicar na apresentação</Text>
            <Text style={styles.tipBody}>
              Mostre que o responsável cria missões, o jogador executa a tarefa real e o sistema
              registra progresso com recompensas.
            </Text>
          </View>

          <Text style={styles.footer}>
            Classes: {options.map((item) => roleLabels[item.id]).join(' • ')}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LifeQuestBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 36,
  },
  label: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  title: {
    color: lifeQuestTheme.colors.text,
    fontSize: 38,
    fontWeight: '800',
    lineHeight: 46,
    marginBottom: 18,
    textAlign: 'center',
  },
  subtitle: {
    color: lifeQuestTheme.colors.text,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 28,
    marginBottom: 36,
    textAlign: 'center',
  },
  list: {
    gap: 14,
    marginBottom: 28,
  },
  classButton: {
    alignItems: 'center',
    backgroundColor: lifeQuestTheme.colors.cardSoft,
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 88,
    paddingHorizontal: 20,
  },
  classButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  classIcon: {
    marginRight: 16,
  },
  classText: {
    flex: 1,
  },
  classTitle: {
    color: lifeQuestTheme.colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  classSubtitle: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 20,
    padding: 20,
  },
  tipTitle: {
    color: lifeQuestTheme.colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  tipBody: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 15,
    lineHeight: 24,
  },
  footer: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 13,
    textAlign: 'center',
  },
});
