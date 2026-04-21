import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LifeQuestBackground } from '@/components/lifequest-background';
import { XpProgressCard } from '@/components/xp-progress-card';
import {
  creatorRoles,
  difficultyLabels,
  durationLabels,
  lifeQuestTheme,
  roleLabels,
} from '@/constants/lifequest-theme';
import {
  Mission,
  MissionDifficulty,
  MissionDuration,
  MissionKind,
  useLifeQuestDemo,
} from '@/contexts/lifequest-demo-context';

const CATEGORIES: MissionKind[] = ['Diaria', 'Semanal', 'Desafio', 'Contrato'];
const DIFFICULTIES: MissionDifficulty[] = ['Facil', 'Media', 'Dificil'];
const DURATIONS: MissionDuration[] = ['Curta', 'Media', 'Longa'];

function MissionHeader({ mission }: { mission: Mission }) {
  return (
    <View style={styles.missionHeader}>
      <View style={styles.missionTag}>
        <Text style={styles.missionTagText}>{mission.category}</Text>
      </View>
      <Text style={styles.missionDue}>{mission.dueLabel}</Text>
    </View>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.emptyCard}>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

export default function MissionsScreen() {
  const {
    activeMissions,
    approveMissionCompletion,
    approvedMissions,
    awaitingApprovalMissions,
    createMission,
    currentLevel,
    currentLevelXp,
    hasAccounts,
    issueReportedMissions,
    levelProgressPercent,
    nextLevelXp,
    profile,
    reportMissionIssue,
    reopenMission,
    submitMissionForApproval,
  } = useLifeQuestDemo();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueLabel, setDueLabel] = useState('');
  const [lq, setLq] = useState('30');
  const [category, setCategory] = useState<MissionKind>('Diaria');
  const [difficulty, setDifficulty] = useState<MissionDifficulty>('Facil');
  const [duration, setDuration] = useState<MissionDuration>('Curta');
  const [completionNotes, setCompletionNotes] = useState<Record<string, string>>({});
  const [delayNotes, setDelayNotes] = useState<Record<string, string>>({});
  const [issueNotes, setIssueNotes] = useState<Record<string, string>>({});

  const canCreateMissions = Boolean(profile && creatorRoles.includes(profile.role));
  const canSubmitMission = useMemo(() => {
    return (
      title.trim().length >= 3 &&
      description.trim().length >= 5 &&
      dueLabel.trim().length >= 3 &&
      (Number(lq) || 0) > 0
    );
  }, [description, dueLabel, lq, title]);

  if (!profile?.name) {
    router.replace((hasAccounts ? '/login' : '/') as never);
    return null;
  }

  const clearMissionDraft = (missionId: string) => {
    setCompletionNotes((current) => ({ ...current, [missionId]: '' }));
    setDelayNotes((current) => ({ ...current, [missionId]: '' }));
    setIssueNotes((current) => ({ ...current, [missionId]: '' }));
  };

  return (
    <LifeQuestBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.kicker}>MISSOES</Text>
          <Text style={styles.title}>Fluxo de validacao</Text>
          <Text style={styles.subtitle}>
            {canCreateMissions
              ? `Perfil ${roleLabels[profile.role]}: cria missoes, recebe justificativas e aprova a entrega final.`
              : `Perfil ${roleLabels[profile.role]}: executa a tarefa, informa atraso ou problema e envia a conclusao para aprovacao.`}
          </Text>

          {!canCreateMissions ? (
            <XpProgressCard
              currentLevel={currentLevel}
              currentLevelXp={currentLevelXp}
              nextLevelXp={nextLevelXp}
              levelProgressPercent={levelProgressPercent}
              totalXp={approvedMissions.reduce((acc, mission) => acc + mission.xp, 0)}
            />
          ) : null}

          {canCreateMissions ? (
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Nova missao</Text>
              <TextInput
                onChangeText={setTitle}
                placeholder="Titulo da missao"
                placeholderTextColor={lifeQuestTheme.colors.muted}
                style={styles.input}
                value={title}
              />
              <TextInput
                onChangeText={setDescription}
                placeholder="Descricao da missao"
                placeholderTextColor={lifeQuestTheme.colors.muted}
                style={[styles.input, styles.inputMultiline]}
                textAlignVertical="top"
                multiline
                numberOfLines={3}
                value={description}
              />
              <View style={styles.categoryRow}>
                {CATEGORIES.map((item) => {
                  const selected = category === item;
                  return (
                    <Pressable
                      key={item}
                      onPress={() => setCategory(item)}
                      style={({ pressed }) => [
                        styles.categoryChip,
                        selected && styles.categoryChipSelected,
                        pressed && styles.buttonPressed,
                      ]}>
                      <Text
                        style={[styles.categoryChipText, selected && styles.categoryChipTextSelected]}>
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.inlineLabel}>Dificuldade</Text>
              <View style={styles.categoryRow}>
                {DIFFICULTIES.map((item) => {
                  const selected = difficulty === item;
                  return (
                    <Pressable
                      key={item}
                      onPress={() => setDifficulty(item)}
                      style={({ pressed }) => [
                        styles.categoryChip,
                        selected && styles.categoryChipSelected,
                        pressed && styles.buttonPressed,
                      ]}>
                      <Text
                        style={[styles.categoryChipText, selected && styles.categoryChipTextSelected]}>
                        {difficultyLabels[item]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.inlineLabel}>Duracao esperada</Text>
              <View style={styles.categoryRow}>
                {DURATIONS.map((item) => {
                  const selected = duration === item;
                  return (
                    <Pressable
                      key={item}
                      onPress={() => setDuration(item)}
                      style={({ pressed }) => [
                        styles.categoryChip,
                        selected && styles.categoryChipSelected,
                        pressed && styles.buttonPressed,
                      ]}>
                      <Text
                        style={[styles.categoryChipText, selected && styles.categoryChipTextSelected]}>
                        {durationLabels[item]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <TextInput
                onChangeText={setDueLabel}
                placeholder="Prazo ex: Hoje, 20:00"
                placeholderTextColor={lifeQuestTheme.colors.muted}
                style={styles.input}
                value={dueLabel}
              />
              <TextInput
                keyboardType="number-pad"
                onChangeText={setLq}
                placeholder="LQ da missao"
                placeholderTextColor={lifeQuestTheme.colors.muted}
                style={styles.input}
                value={lq}
              />
              <Text style={styles.systemHint}>
                O sistema define automaticamente apenas o XP da missao com base na dificuldade e
                no tempo estimado. O LQ continua sendo informado separadamente na criacao.
              </Text>
              <Pressable
                disabled={!canSubmitMission}
                onPress={() => {
                  createMission({
                    title: title.trim(),
                    description: description.trim(),
                    category,
                    difficulty,
                    duration,
                    dueLabel: dueLabel.trim(),
                    lq: Number(lq) || 0,
                  });
                  setTitle('');
                  setDescription('');
                  setDueLabel('');
                  setLq('30');
                  setCategory('Diaria');
                  setDifficulty('Facil');
                  setDuration('Curta');
                }}
                style={({ pressed }) => [
                  styles.submitButton,
                  !canSubmitMission && styles.buttonDisabled,
                  pressed && canSubmitMission && styles.buttonPressed,
                ]}>
                <MaterialIcons color={lifeQuestTheme.colors.text} name="add-task" size={20} />
                <Text style={styles.submitButtonText}>Criar missao</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Somente superiores criam missoes</Text>
              <Text style={styles.infoText}>
                Neste perfil, voce executa a tarefa, registra o que foi feito e envia a conclusao
                para o gerente ou responsavel aprovar.
              </Text>
            </View>
          )}

          {canCreateMissions ? (
            <View style={styles.listSection}>
              <Text style={styles.sectionTitle}>Aguardando aprovacao</Text>
              {awaitingApprovalMissions.length === 0 ? (
                <EmptyState text="Nenhuma entrega aguardando aprovacao no momento." />
              ) : (
                awaitingApprovalMissions.map((mission) => (
                  <View key={mission.id} style={[styles.missionCard, styles.awaitingCard]}>
                    <MissionHeader mission={mission} />
                    <Text style={styles.missionTitle}>{mission.title}</Text>
                    <Text style={styles.missionDescription}>{mission.description}</Text>
                    <Text style={styles.metaText}>
                      Sistema: {mission.difficulty} • {mission.duration}
                    </Text>
                    <Text style={styles.detailTitle}>Resumo do funcionario</Text>
                    <Text style={styles.detailText}>{mission.completionRequest?.summary}</Text>
                    <Text style={styles.detailTitle}>Motivo de atraso</Text>
                    <Text style={styles.detailText}>
                      {mission.completionRequest?.delayReason || 'Sem atraso informado.'}
                    </Text>
                    <View style={styles.actionRow}>
                      <Pressable
                        onPress={() => approveMissionCompletion(mission.id)}
                        style={({ pressed }) => [
                          styles.primaryButton,
                          pressed && styles.buttonPressed,
                        ]}>
                        <Text style={styles.primaryButtonText}>Aprovar conclusao</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => reopenMission(mission.id)}
                        style={({ pressed }) => [
                          styles.secondaryButton,
                          pressed && styles.buttonPressed,
                        ]}>
                        <Text style={styles.secondaryButtonText}>Pedir ajuste</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              )}
            </View>
          ) : (
            <View style={styles.listSection}>
              <Text style={styles.sectionTitle}>Missoes ativas</Text>
              {activeMissions.length === 0 ? (
                <EmptyState text="Nenhuma missao ativa disponivel agora." />
              ) : (
                activeMissions.map((mission) => {
                  const completionNote = completionNotes[mission.id] ?? '';
                  const delayNote = delayNotes[mission.id] ?? '';
                  const issueNote = issueNotes[mission.id] ?? '';

                  return (
                    <View key={mission.id} style={styles.missionCard}>
                      <MissionHeader mission={mission} />
                      <Text style={styles.missionTitle}>{mission.title}</Text>
                      <Text style={styles.missionDescription}>{mission.description}</Text>
                      <Text style={styles.metaText}>
                        Sistema: {mission.difficulty} • {mission.duration}
                      </Text>
                      <Text style={styles.metaText}>
                        Recompensa do sistema: {mission.xp} XP • {mission.lq} LQ
                      </Text>
                      <TextInput
                        onChangeText={(value) =>
                          setCompletionNotes((current) => ({ ...current, [mission.id]: value }))
                        }
                        placeholder="O que foi feito para concluir a missao?"
                        placeholderTextColor={lifeQuestTheme.colors.muted}
                        style={[styles.input, styles.inputMultiline]}
                        textAlignVertical="top"
                        multiline
                        numberOfLines={3}
                        value={completionNote}
                      />
                      <TextInput
                        onChangeText={(value) =>
                          setDelayNotes((current) => ({ ...current, [mission.id]: value }))
                        }
                        placeholder="Motivo do atraso, se houve"
                        placeholderTextColor={lifeQuestTheme.colors.muted}
                        style={styles.input}
                        value={delayNote}
                      />
                      <TextInput
                        onChangeText={(value) =>
                          setIssueNotes((current) => ({ ...current, [mission.id]: value }))
                        }
                        placeholder="Motivo da nao conclusao, se nao conseguiu finalizar"
                        placeholderTextColor={lifeQuestTheme.colors.muted}
                        style={styles.input}
                        value={issueNote}
                      />
                      <View style={styles.actionRow}>
                        <Pressable
                          disabled={completionNote.trim().length < 4}
                          onPress={() => {
                            submitMissionForApproval({
                              missionId: mission.id,
                              summary: completionNote.trim(),
                              delayReason: delayNote.trim(),
                            });
                            clearMissionDraft(mission.id);
                          }}
                          style={({ pressed }) => [
                            styles.primaryButton,
                            completionNote.trim().length < 4 && styles.buttonDisabled,
                            pressed && completionNote.trim().length >= 4 && styles.buttonPressed,
                          ]}>
                          <Text style={styles.primaryButtonText}>Enviar para aprovacao</Text>
                        </Pressable>
                        <Pressable
                          disabled={issueNote.trim().length < 5}
                          onPress={() => {
                            reportMissionIssue({
                              missionId: mission.id,
                              reason: issueNote.trim(),
                            });
                            clearMissionDraft(mission.id);
                          }}
                          style={({ pressed }) => [
                            styles.secondaryButton,
                            issueNote.trim().length < 5 && styles.buttonDisabled,
                            pressed && issueNote.trim().length >= 5 && styles.buttonPressed,
                          ]}>
                          <Text style={styles.secondaryButtonText}>Nao conclui</Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}

          {canCreateMissions ? (
            <View style={styles.listSection}>
              <Text style={styles.sectionTitle}>Justificativas de nao conclusao</Text>
              {issueReportedMissions.length === 0 ? (
                <EmptyState text="Nenhuma justificativa aberta no momento." />
              ) : (
                issueReportedMissions.map((mission) => (
                  <View key={mission.id} style={[styles.missionCard, styles.issueCard]}>
                    <MissionHeader mission={mission} />
                    <Text style={styles.missionTitle}>{mission.title}</Text>
                    <Text style={styles.missionDescription}>{mission.description}</Text>
                    <Text style={styles.metaText}>
                      Sistema: {mission.difficulty} • {mission.duration}
                    </Text>
                    <Text style={styles.detailTitle}>Motivo informado</Text>
                    <Text style={styles.detailText}>{mission.issueReport?.reason}</Text>
                    <Pressable
                      onPress={() => reopenMission(mission.id)}
                      style={({ pressed }) => [
                        styles.secondaryButton,
                        styles.singleButton,
                        pressed && styles.buttonPressed,
                      ]}>
                      <Text style={styles.secondaryButtonText}>Entendi, reabrir tarefa</Text>
                    </Pressable>
                  </View>
                ))
              )}
            </View>
          ) : (
            <View style={styles.listSection}>
              <Text style={styles.sectionTitle}>Em analise do superior</Text>
              {awaitingApprovalMissions.length === 0 ? (
                <EmptyState text="Nenhuma entrega enviada para aprovacao ainda." />
              ) : (
                awaitingApprovalMissions.map((mission) => (
                  <View key={mission.id} style={[styles.missionCard, styles.awaitingCard]}>
                    <MissionHeader mission={mission} />
                    <Text style={styles.missionTitle}>{mission.title}</Text>
                    <Text style={styles.missionDescription}>{mission.description}</Text>
                    <Text style={styles.metaText}>
                      Sistema: {mission.difficulty} • {mission.duration}
                    </Text>
                    <Text style={styles.detailTitle}>Resumo enviado</Text>
                    <Text style={styles.detailText}>{mission.completionRequest?.summary}</Text>
                    <Text style={styles.helperText}>
                      Aguardando aprovacao do gerente ou responsavel.
                    </Text>
                  </View>
                ))
              )}
            </View>
          )}

          {canCreateMissions ? (
            <View style={styles.listSection}>
              <Text style={styles.sectionTitle}>Missoes em andamento</Text>
              {activeMissions.length === 0 ? (
                <EmptyState text="Nenhuma missao em andamento agora." />
              ) : (
                activeMissions.map((mission) => (
                  <View key={mission.id} style={styles.missionCard}>
                    <MissionHeader mission={mission} />
                    <Text style={styles.missionTitle}>{mission.title}</Text>
                    <Text style={styles.missionDescription}>{mission.description}</Text>
                    <Text style={styles.metaText}>
                      Sistema: {mission.difficulty} • {mission.duration} • {mission.assigneeLabel}
                    </Text>
                    <View style={styles.missionFooter}>
                      <Text style={styles.rewardText}>
                        {mission.xp} XP • {mission.lq} LQ
                      </Text>
                      <Text style={styles.statusBadge}>Em andamento</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          ) : (
            <View style={styles.listSection}>
              <Text style={styles.sectionTitle}>Nao concluidas</Text>
              {issueReportedMissions.length === 0 ? (
                <EmptyState text="Nenhuma justificativa de nao conclusao enviada." />
              ) : (
                issueReportedMissions.map((mission) => (
                  <View key={mission.id} style={[styles.missionCard, styles.issueCard]}>
                    <MissionHeader mission={mission} />
                    <Text style={styles.missionTitle}>{mission.title}</Text>
                    <Text style={styles.missionDescription}>{mission.description}</Text>
                    <Text style={styles.metaText}>
                      Sistema: {mission.difficulty} • {mission.duration}
                    </Text>
                    <Text style={styles.detailTitle}>Motivo enviado</Text>
                    <Text style={styles.detailText}>{mission.issueReport?.reason}</Text>
                    <Text style={styles.helperText}>
                      O superior ja consegue visualizar esta justificativa.
                    </Text>
                  </View>
                ))
              )}
            </View>
          )}

          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>Concluidas e aprovadas</Text>
            {approvedMissions.length === 0 ? (
              <EmptyState text="Nenhuma missao aprovada ainda." />
            ) : (
              approvedMissions.map((mission) => (
                <View key={mission.id} style={[styles.missionCard, styles.approvedCard]}>
                  <MissionHeader mission={mission} />
                  <Text style={styles.missionTitle}>{mission.title}</Text>
                  <Text style={styles.missionDescription}>{mission.description}</Text>
                  <Text style={styles.metaText}>
                    Sistema: {mission.difficulty} • {mission.duration}
                  </Text>
                  <Text style={styles.detailTitle}>Entrega registrada</Text>
                  <Text style={styles.detailText}>
                    {mission.completionRequest?.summary || 'Missao aprovada sem observacao extra.'}
                  </Text>
                  {mission.completionRequest?.delayReason ? (
                    <>
                      <Text style={styles.detailTitle}>Motivo do atraso</Text>
                      <Text style={styles.detailText}>{mission.completionRequest.delayReason}</Text>
                    </>
                  ) : null}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LifeQuestBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 42 },
  kicker: { color: lifeQuestTheme.colors.accent, fontSize: 12, fontWeight: '800', marginBottom: 10 },
  title: { color: lifeQuestTheme.colors.text, fontSize: 32, fontWeight: '800', lineHeight: 40, marginBottom: 8 },
  subtitle: { color: lifeQuestTheme.colors.muted, fontSize: 15, lineHeight: 23, marginBottom: 20 },
  formCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: lifeQuestTheme.colors.cardBorder, borderRadius: 26, borderWidth: 1, marginBottom: 22, padding: 18 },
  infoCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: lifeQuestTheme.colors.cardBorder, borderRadius: 26, borderWidth: 1, marginBottom: 22, padding: 18 },
  infoTitle: { color: lifeQuestTheme.colors.text, fontSize: 18, fontWeight: '800', marginBottom: 10 },
  infoText: { color: lifeQuestTheme.colors.muted, fontSize: 15, lineHeight: 23 },
  sectionTitle: { color: lifeQuestTheme.colors.text, fontSize: 19, fontWeight: '800', marginBottom: 14 },
  inlineLabel: { color: lifeQuestTheme.colors.text, fontSize: 14, fontWeight: '700', marginBottom: 10 },
  input: { backgroundColor: lifeQuestTheme.colors.card, borderRadius: 18, color: lifeQuestTheme.colors.text, fontSize: 15, marginBottom: 12, minHeight: 52, paddingHorizontal: 16, paddingVertical: 14 },
  inputMultiline: { minHeight: 92 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  categoryChip: { backgroundColor: lifeQuestTheme.colors.card, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
  categoryChipSelected: { backgroundColor: lifeQuestTheme.colors.accentSoft },
  categoryChipText: { color: lifeQuestTheme.colors.muted, fontSize: 13, fontWeight: '700' },
  categoryChipTextSelected: { color: lifeQuestTheme.colors.accent },
  systemHint: { color: lifeQuestTheme.colors.muted, fontSize: 13, lineHeight: 20, marginBottom: 14 },
  submitButton: { alignItems: 'center', backgroundColor: lifeQuestTheme.colors.accent, borderRadius: 18, flexDirection: 'row', gap: 10, justifyContent: 'center', marginTop: 4, minHeight: 54 },
  submitButtonText: { color: lifeQuestTheme.colors.text, fontSize: 16, fontWeight: '800' },
  listSection: { marginBottom: 22 },
  missionCard: { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: lifeQuestTheme.colors.cardBorder, borderRadius: 22, borderWidth: 1, marginBottom: 12, padding: 16 },
  awaitingCard: { backgroundColor: 'rgba(244,183,64,0.10)' },
  approvedCard: { backgroundColor: 'rgba(45,216,129,0.08)' },
  issueCard: { backgroundColor: 'rgba(255,107,107,0.09)' },
  emptyCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: lifeQuestTheme.colors.cardBorder, borderRadius: 20, borderWidth: 1, padding: 16 },
  emptyText: { color: lifeQuestTheme.colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  missionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  missionTag: { backgroundColor: lifeQuestTheme.colors.accentSoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  missionTagText: { color: lifeQuestTheme.colors.text, fontSize: 12, fontWeight: '700' },
  missionDue: { color: lifeQuestTheme.colors.muted, fontSize: 12, fontWeight: '600' },
  missionTitle: { color: lifeQuestTheme.colors.text, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  missionDescription: { color: lifeQuestTheme.colors.muted, fontSize: 14, lineHeight: 22, marginBottom: 12 },
  metaText: { color: lifeQuestTheme.colors.muted, fontSize: 13, lineHeight: 20, marginBottom: 10 },
  detailTitle: { color: lifeQuestTheme.colors.text, fontSize: 13, fontWeight: '800', marginBottom: 4, marginTop: 4 },
  detailText: { color: lifeQuestTheme.colors.muted, fontSize: 14, lineHeight: 21, marginBottom: 8 },
  helperText: { color: lifeQuestTheme.colors.muted, fontSize: 13, lineHeight: 20, marginTop: 6 },
  missionFooter: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  rewardText: { color: lifeQuestTheme.colors.text, fontSize: 14, fontWeight: '700' },
  statusBadge: { color: lifeQuestTheme.colors.warning, fontSize: 13, fontWeight: '800' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  primaryButton: { alignItems: 'center', backgroundColor: lifeQuestTheme.colors.accent, borderRadius: 16, flex: 1, justifyContent: 'center', minHeight: 46, paddingHorizontal: 12 },
  secondaryButton: { alignItems: 'center', backgroundColor: lifeQuestTheme.colors.card, borderRadius: 16, flex: 1, justifyContent: 'center', minHeight: 46, paddingHorizontal: 12 },
  singleButton: { marginTop: 8 },
  primaryButtonText: { color: lifeQuestTheme.colors.text, fontSize: 13, fontWeight: '800', textAlign: 'center' },
  secondaryButtonText: { color: lifeQuestTheme.colors.text, fontSize: 13, fontWeight: '800', textAlign: 'center' },
  buttonDisabled: { opacity: 0.45 },
  buttonPressed: { opacity: 0.88 },
});
