import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LifeQuestBackground } from '@/components/lifequest-background';
import {
  getLoreHeader,
  getPerformanceChapter,
  getRankLore,
} from '@/constants/lifequest-lore';
import { creatorRoles, lifeQuestTheme, roleLabels } from '@/constants/lifequest-theme';
import {
  WellnessSessionResult,
  useLifeQuestDemo,
} from '@/contexts/lifequest-demo-context';

const RUNES = [
  { id: 'sol', icon: 'wb-sunny', title: 'Sol de foco', hint: 'Claridade mental' },
  { id: 'luna', icon: 'nights-stay', title: 'Lua calma', hint: 'Respiracao e pausa' },
  { id: 'folha', icon: 'spa', title: 'Folha vital', hint: 'Recuperacao e energia' },
] as const;

const TOTAL_ROUNDS = 8;

function randomRuneId() {
  return RUNES[Math.floor(Math.random() * RUNES.length)]!.id;
}

export default function ArenaScreen() {
  const {
    hasAccounts,
    personalInsights,
    profile,
    recordWellnessSession,
    teamInsights,
    wellness,
  } = useLifeQuestDemo();
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [targetRuneId, setTargetRuneId] = useState(() => randomRuneId());
  const [selectedRuneId, setSelectedRuneId] = useState<string | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [feedback, setFeedback] = useState('Toque em iniciar e combine as runas certas para ganhar LQ.');
  const [sessionSummary, setSessionSummary] = useState<WellnessSessionResult | null>(null);

  const canCreateMissions = Boolean(profile && creatorRoles.includes(profile.role));
  const insight = canCreateMissions ? teamInsights : personalInsights;
  const recentSessions = useMemo(() => wellness?.sessions.slice(0, 4) ?? [], [wellness]);
  const targetRune = RUNES.find((item) => item.id === targetRuneId) ?? RUNES[0];

  useEffect(() => {
    if (!profile?.name) {
      router.replace((hasAccounts ? '/login' : '/') as never);
    }
  }, [hasAccounts, profile?.name]);

  if (!profile?.name) {
    return null;
  }

  const loreHeader = getLoreHeader(profile.role, profile.environment);
  const chapter = getPerformanceChapter(insight, canCreateMissions);

  const resetGame = () => {
    setRound(1);
    setScore(0);
    setTargetRuneId(randomRuneId());
    setSelectedRuneId(null);
    setSessionStarted(false);
    setSessionFinished(false);
    setSessionSummary(null);
    setFeedback('Toque em iniciar e combine as runas certas para ganhar LQ.');
  };

  const startGame = () => {
    setRound(1);
    setScore(0);
    setSessionStarted(true);
    setSessionFinished(false);
    setSessionSummary(null);
    setSelectedRuneId(null);
    setTargetRuneId(randomRuneId());
    setFeedback('Observe a runa alvo e toque na energia correspondente.');
  };

  const handleRunePress = (runeId: string) => {
    if (!sessionStarted || sessionFinished) {
      return;
    }

    const hit = runeId === targetRuneId;
    const nextScore = hit ? score + 1 : score;
    const nextRound = round + 1;

    setSelectedRuneId(runeId);
    setScore(nextScore);
    setFeedback(
      hit
        ? 'Boa. Sua leitura ficou alinhada e seu foco aumentou.'
        : 'Quase. Respira, recentra e tenta a proxima rodada.',
    );

    if (round >= TOTAL_ROUNDS) {
      setSessionFinished(true);
      setSessionStarted(false);
      const result = recordWellnessSession(nextScore);
      setSessionSummary(result);
      return;
    }

    setTimeout(() => {
      setRound(nextRound);
      setSelectedRuneId(null);
      setTargetRuneId(randomRuneId());
    }, 380);
  };

  return (
    <LifeQuestBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.kicker}>ARENA</Text>
          <Text style={styles.title} testID="arena-title">Ritual das runas</Text>
          <Text style={styles.subtitle}>
            Um mini game rapido para aliviar a tensao, gerar foco e liberar LQ bonus sem mexer nas
            regras automaticas de XP.
          </Text>

          <View style={styles.storyCard}>
            <Text style={styles.storyEyebrow}>RITO ATUAL</Text>
            <Text style={styles.storyTitle}>{loreHeader.roleTitle}</Text>
            <Text style={styles.storyBody}>{chapter}</Text>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <View>
                <Text style={styles.heroEyebrow}>{roleLabels[profile.role]}</Text>
                <Text style={styles.heroName}>{profile.name}</Text>
              </View>
              <View style={styles.heroBadge}>
                <MaterialIcons color={lifeQuestTheme.colors.text} name="auto-awesome" size={18} />
                <Text style={styles.heroBadgeText}>{wellness?.currentStreak ?? 0} dias</Text>
              </View>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>LQ do mini game</Text>
                <Text style={styles.metricValue}>{wellness?.totalRewardLq ?? 0}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Melhor placar</Text>
                <Text style={styles.metricValue}>{wellness?.bestScore ?? 0}/{TOTAL_ROUNDS}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Indice de foco</Text>
                <Text style={styles.metricValue}>{insight?.focusIndex ?? 0}%</Text>
              </View>
            </View>
          </View>

          <View style={styles.gameCard} testID="arena-game-card">
            <View style={styles.gameTopRow}>
              <View>
                <Text style={styles.sectionTitle}>Sessao de foco</Text>
                <Text style={styles.sectionHint}>
                  Rodada {Math.min(round, TOTAL_ROUNDS)} de {TOTAL_ROUNDS}
                </Text>
              </View>
              <View style={styles.roundBadge}>
                <Text style={styles.roundBadgeText}>{score} acertos</Text>
              </View>
            </View>

            <View style={styles.targetCard}>
              <MaterialIcons
                color={lifeQuestTheme.colors.accent}
                name={targetRune.icon}
                size={38}
              />
              <Text style={styles.targetTitle} testID="arena-target-title">{targetRune.title}</Text>
              <Text style={styles.targetHint}>{targetRune.hint}</Text>
            </View>

            <Text style={styles.feedbackText}>{feedback}</Text>

            <View style={styles.runeGrid}>
              {RUNES.map((rune) => {
                const selected = rune.id === selectedRuneId;
                return (
                  <Pressable
                    key={rune.id}
                    disabled={!sessionStarted || sessionFinished}
                    onPress={() => {
                      void handleRunePress(rune.id);
                    }}
                    testID={`rune-${rune.id}`}
                    style={({ pressed }) => [
                      styles.runeButton,
                      selected && styles.runeButtonSelected,
                      (!sessionStarted || sessionFinished) && styles.runeButtonDisabled,
                      pressed && sessionStarted && !sessionFinished && styles.buttonPressed,
                    ]}>
                    <MaterialIcons
                      color={lifeQuestTheme.colors.text}
                      name={rune.icon}
                      size={28}
                    />
                    <Text style={styles.runeButtonTitle}>{rune.title}</Text>
                    <Text style={styles.runeButtonHint}>{rune.hint}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.actionRow}>
              {!sessionStarted && !sessionFinished ? (
                <Pressable
                  onPress={startGame}
                  testID="arena-start-button"
                  style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
                  <Text style={styles.primaryButtonText}>Iniciar sessao</Text>
                </Pressable>
              ) : null}

              {sessionFinished ? (
                <>
                  <Pressable onPress={startGame} style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
                    <Text style={styles.primaryButtonText}>Jogar de novo</Text>
                  </Pressable>
                  <Pressable onPress={resetGame} style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}>
                    <Text style={styles.secondaryButtonText}>Fechar resultado</Text>
                  </Pressable>
                </>
              ) : null}
            </View>
          </View>

          {sessionSummary ? (
            <View style={styles.resultCard}>
              <Text style={styles.sectionTitle}>Resultado da ultima sessao</Text>
              <Text style={styles.resultHeadline}>{sessionSummary.label}</Text>
              <Text style={styles.resultBody}>
                Voce fechou a rodada com {wellness?.lastScore ?? score} acertos, recebeu {sessionSummary.rewardLq} LQ
                e elevou seu foco em {sessionSummary.focusGain} pontos.
              </Text>
              <Text style={styles.resultLore}>{getRankLore(sessionSummary.rank)}</Text>
              <View style={styles.resultRow}>
                <View style={styles.resultPill}>
                  <Text style={styles.resultPillText}>Rank {sessionSummary.rank}</Text>
                </View>
                <View style={styles.resultPill}>
                  <Text style={styles.resultPillText}>Sequencia {sessionSummary.currentStreak} dias</Text>
                </View>
              </View>
            </View>
          ) : null}

          <View style={styles.insightsCard}>
            <Text style={styles.sectionTitle}>
              {canCreateMissions ? 'Leitura geral da equipe' : 'Como isso melhora seu desempenho'}
            </Text>
            <Text style={styles.insightText}>
              {canCreateMissions
                ? 'O mini game nao substitui produtividade, mas ajuda a perceber constancia, foco e ritmo da equipe entre as entregas.'
                : 'Sua sessao de foco soma no indicador pessoal e ajuda voce a equilibrar energia, constancia e clareza antes de concluir novas missoes.'}
            </Text>

            <View style={styles.metricRow}>
              <View style={styles.insightMetric}>
                <Text style={styles.metricLabel}>Produtividade</Text>
                <Text style={styles.metricValue}>{insight?.score ?? 0}%</Text>
              </View>
              <View style={styles.insightMetric}>
                <Text style={styles.metricLabel}>Confiabilidade</Text>
                <Text style={styles.metricValue}>{insight?.reliability ?? 0}%</Text>
              </View>
              <View style={styles.insightMetric}>
                <Text style={styles.metricLabel}>Ritmo</Text>
                <Text style={styles.metricValue}>{insight?.completionRate ?? 0}%</Text>
              </View>
            </View>
          </View>

          <View style={styles.historyCard}>
            <Text style={styles.sectionTitle}>Historico recente</Text>
            {recentSessions.length === 0 ? (
              <Text style={styles.historyEmpty}>
                Sua primeira sessao vai aparecer aqui com o placar e a recompensa conquistada.
              </Text>
            ) : (
              recentSessions.map((session) => (
                <View key={`${session.playedAt}-${session.score}`} style={styles.historyRow}>
                  <View>
                    <Text style={styles.historyTitle}>{session.label}</Text>
                    <Text style={styles.historyDate}>
                      {new Date(session.playedAt).toLocaleString('pt-BR')}
                    </Text>
                  </View>
                  <View style={styles.historyValues}>
                    <Text style={styles.historyBadge}>{session.rewardLq} LQ</Text>
                    <Text style={styles.historyBadge}>{session.score}/{TOTAL_ROUNDS}</Text>
                  </View>
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
  storyCard: {
    backgroundColor: '#1C2531',
    borderRadius: 24,
    marginBottom: 18,
    padding: 18,
  },
  storyEyebrow: { color: lifeQuestTheme.colors.warning, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  storyTitle: { color: lifeQuestTheme.colors.text, fontSize: 20, fontWeight: '800', marginBottom: 8 },
  storyBody: { color: lifeQuestTheme.colors.muted, fontSize: 14, lineHeight: 22 },
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 18,
    padding: 20,
  },
  heroHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  heroEyebrow: { color: lifeQuestTheme.colors.muted, fontSize: 13, fontWeight: '700', marginBottom: 4 },
  heroName: { color: lifeQuestTheme.colors.text, fontSize: 24, fontWeight: '800' },
  heroBadge: {
    alignItems: 'center',
    backgroundColor: lifeQuestTheme.colors.accentSoft,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  heroBadgeText: { color: lifeQuestTheme.colors.text, fontSize: 13, fontWeight: '800' },
  metricRow: { flexDirection: 'row', gap: 10 },
  metricCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    padding: 14,
  },
  metricLabel: { color: lifeQuestTheme.colors.muted, fontSize: 12, fontWeight: '700', marginBottom: 8 },
  metricValue: { color: lifeQuestTheme.colors.text, fontSize: 22, fontWeight: '800' },
  gameCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 18,
    padding: 20,
  },
  gameTopRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitle: { color: lifeQuestTheme.colors.text, fontSize: 19, fontWeight: '800', marginBottom: 6 },
  sectionHint: { color: lifeQuestTheme.colors.muted, fontSize: 13, fontWeight: '600' },
  roundBadge: {
    backgroundColor: lifeQuestTheme.colors.successSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  roundBadgeText: { color: lifeQuestTheme.colors.success, fontSize: 13, fontWeight: '800' },
  targetCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(92, 141, 255, 0.10)',
    borderRadius: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 22,
  },
  targetTitle: { color: lifeQuestTheme.colors.text, fontSize: 21, fontWeight: '800', marginTop: 10, marginBottom: 6 },
  targetHint: { color: lifeQuestTheme.colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  feedbackText: { color: lifeQuestTheme.colors.muted, fontSize: 14, lineHeight: 21, marginBottom: 14, textAlign: 'center' },
  runeGrid: { gap: 10 },
  runeButton: {
    alignItems: 'center',
    backgroundColor: lifeQuestTheme.colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  runeButtonSelected: {
    borderColor: lifeQuestTheme.colors.accent,
    backgroundColor: 'rgba(92, 141, 255, 0.18)',
  },
  runeButtonDisabled: { opacity: 0.9 },
  runeButtonTitle: { color: lifeQuestTheme.colors.text, fontSize: 16, fontWeight: '800', marginTop: 8, marginBottom: 4 },
  runeButtonHint: { color: lifeQuestTheme.colors.muted, fontSize: 13, textAlign: 'center' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: lifeQuestTheme.colors.accent,
    borderRadius: 18,
    flex: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: lifeQuestTheme.colors.card,
    borderRadius: 18,
    flex: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
  },
  primaryButtonText: { color: lifeQuestTheme.colors.text, fontSize: 15, fontWeight: '800' },
  secondaryButtonText: { color: lifeQuestTheme.colors.text, fontSize: 15, fontWeight: '800' },
  resultCard: {
    backgroundColor: 'rgba(45,216,129,0.10)',
    borderColor: 'rgba(45,216,129,0.26)',
    borderRadius: 26,
    borderWidth: 1,
    marginBottom: 18,
    padding: 20,
  },
  resultHeadline: { color: lifeQuestTheme.colors.text, fontSize: 22, fontWeight: '800', marginBottom: 8 },
  resultBody: { color: lifeQuestTheme.colors.muted, fontSize: 14, lineHeight: 22 },
  resultLore: { color: lifeQuestTheme.colors.text, fontSize: 13, lineHeight: 20, marginTop: 10, opacity: 0.9 },
  resultRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  resultPill: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  resultPillText: { color: lifeQuestTheme.colors.text, fontSize: 13, fontWeight: '700' },
  insightsCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 26,
    borderWidth: 1,
    marginBottom: 18,
    padding: 20,
  },
  insightText: { color: lifeQuestTheme.colors.muted, fontSize: 14, lineHeight: 22, marginBottom: 16 },
  insightMetric: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    flex: 1,
    padding: 14,
  },
  historyCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 26,
    borderWidth: 1,
    padding: 20,
  },
  historyEmpty: { color: lifeQuestTheme.colors.muted, fontSize: 14, lineHeight: 21 },
  historyRow: {
    alignItems: 'center',
    borderTopColor: lifeQuestTheme.colors.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  historyTitle: { color: lifeQuestTheme.colors.text, fontSize: 15, fontWeight: '800', marginBottom: 4 },
  historyDate: { color: lifeQuestTheme.colors.muted, fontSize: 12, fontWeight: '600' },
  historyValues: { alignItems: 'flex-end', gap: 6 },
  historyBadge: {
    color: lifeQuestTheme.colors.text,
    fontSize: 12,
    fontWeight: '800',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  buttonPressed: { opacity: 0.88 },
});
