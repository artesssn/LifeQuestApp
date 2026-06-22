import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LifeQuestAuthShell } from '@/components/lifequest-auth-shell';
import { LifeQuestBackground } from '@/components/lifequest-background';
import { environmentLabels, lifeQuestTheme } from '@/constants/lifequest-theme';
import { lifeQuestTypography } from '@/constants/lifequest-typography';
import { EnvironmentType, RoleType, useLifeQuestDemo } from '@/contexts/lifequest-demo-context';

const residentialOptions = [
  {
    id: 'guardiao',
    title: 'Responsavel',
    subtitle: 'Cria e valida tarefas no ambiente residencial.',
    icon: 'shield',
  },
  {
    id: 'heroi',
    title: 'Usuario',
    subtitle: 'Executa atividades e acompanha o proprio progresso.',
    icon: 'person',
  },
] satisfies { id: RoleType; title: string; subtitle: string; icon: keyof typeof MaterialIcons.glyphMap }[];

const businessOptions = [
  {
    id: 'representante',
    title: 'Gestor',
    subtitle: 'Gerencia tarefas, validacoes e produtividade da equipe.',
    icon: 'badge',
  },
  {
    id: 'profissionais',
    title: 'Colaborador',
    subtitle: 'Recebe, assume e conclui as missoes operacionais.',
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

  const options = tipo === 'residencial' ? residentialOptions : businessOptions;

  return (
    <LifeQuestBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <LifeQuestAuthShell
            kicker="Perfil"
            title="Escolha o papel do usuario"
            subtitle={`Voce selecionou ${environmentLabels[tipo].toLowerCase()}. Agora defina o tipo de acesso para continuar.`}
            sideTitle="Como apresentar"
            sideBody="Explique que o superior cria tarefas e valida resultados, enquanto o executor assume, conclui e recebe progresso no sistema.">
            <View style={styles.list}>
              {options.map((option) => (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    setJourney(tipo, option.id);
                    router.push('/cadastro' as never);
                  }}
                  style={({ pressed }) => [styles.classButton, pressed && styles.classButtonPressed]}
                  testID={`role-${option.id}`}>
                  <View style={styles.classIconWrap}>
                    <MaterialIcons
                      color={lifeQuestTheme.colors.text}
                      name={option.icon}
                      size={22}
                    />
                  </View>
                  <View style={styles.classText}>
                    <Text style={styles.classTitle}>{option.title}</Text>
                    <Text style={styles.classSubtitle}>{option.subtitle}</Text>
                  </View>
                  <MaterialIcons color={lifeQuestTheme.colors.mutedStrong} name="arrow-forward" size={20} />
                </Pressable>
              ))}
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Resumo do fluxo</Text>
              <Text style={styles.infoBody}>
                O perfil escolhido altera a experiencia do app: gestor visualiza criacao, validacao e produtividade; colaborador visualiza execucao, foco e recompensas.
              </Text>
            </View>
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
  list: {
    gap: 14,
  },
  classButton: {
    alignItems: 'center',
    backgroundColor: lifeQuestTheme.colors.cardElevated,
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: lifeQuestTheme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 88,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  classButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.992 }],
  },
  classIconWrap: {
    alignItems: 'center',
    backgroundColor: lifeQuestTheme.colors.accentSoft,
    borderRadius: 18,
    height: 50,
    justifyContent: 'center',
    marginRight: 14,
    width: 50,
  },
  classText: {
    flex: 1,
  },
  classTitle: {
    ...lifeQuestTypography.cardTitle,
    marginBottom: 4,
  },
  classSubtitle: {
    ...lifeQuestTypography.body,
    fontSize: 13,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: lifeQuestTheme.radius.md,
    borderWidth: 1,
    marginTop: 18,
    padding: 16,
  },
  infoTitle: {
    ...lifeQuestTypography.cardTitle,
    marginBottom: 8,
  },
  infoBody: {
    ...lifeQuestTypography.body,
  },
});
