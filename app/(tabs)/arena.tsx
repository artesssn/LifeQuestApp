import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LifeQuestBackground } from '@/components/lifequest-background';
import { LifeQuestMenu } from '@/components/lifequest-menu';
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

const GRID_SIZE = 9;
const TOTAL_ROUNDS = 12;
const ROUND_MS = 1800;

function randomIndex() {
  return Math.floor(Math.random() * GRID_SIZE);
}

export default function ArenaScreen() {
  const {
    hasAccounts,
    isReady,
    personalInsights,
    profile,
    recordWellnessSession,
    teamInsights,
    wellness,
  } = useLifeQuestDemo();
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [targetIndex, setTargetIndex] = useState(() => randomIndex());
  const [timeLeftMs, setTimeLeftMs] = useState(ROUND_MS);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [feedback, setFeedback] = useState(
    'Inicie o treino e toque rapidamente no bloco azul destacado.'
  );
  const [sessionSummary, setSessionSummary] = useState<WellnessSessionResult | null>(null);
  const [finalFocusScore, setFinalFocusScore] = useState(0);

  const canCreateMissions = Boolean(profile && creatorRoles.includes(profile.role));
  const insight = canCreateMissions ? teamInsights : personalInsights;
  const recentSessions = useMemo(() => wellness?.sessions.slice(0, 4) ?? [], [wellness]);

  const finishSession = useCallback((finalHits: number) => {
    const normalizedScore = Math.min(10, Math.max(1, Math.round((finalHits / TOTAL_ROUNDS) * 10)));
    setFinalFocusScore(normalizedScore);
    setSessionStarted(false);
    setSessionFinished(true);
    const result = recordWellnessSession(normalizedScore);
    setSessionSummary(result);
    setFeedback('Sessao encerrada. O resultado foi enviado para o indicador de foco do app.');
  }, [recordWellnessSession]);

  const proceedToNextRound = useCallback((hit: boolean) => {
    const nextScore = hit ? score + 1 : score;

    if (hit) {
      setScore(nextScore);
      setFeedback('Boa resposta. Continue com o mesmo ritmo.');
    } else {
      setFeedback('Tempo encerrado. Vamos para a proxima rodada.');
    }

    if (round >= TOTAL_ROUNDS) {
      finishSession(nextScore);
      return;
    }

    setRound((current) => current + 1);
    setTargetIndex(randomIndex());
    setTimeLeftMs(Math.max(900, ROUND_MS - round * 70));
  }, [finishSession, round, score]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!profile?.name) {
      router.replace((hasAccounts ? '/login' : '/') as never);
    }
  }, [hasAccounts, isReady, profile?.name]);

  useEffect(() => {
    if (!sessionStarted || sessionFinished) {
      return;
    }

    if (timeLeftMs <= 0) {
      proceedToNextRound(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeftMs((current) => current - 100);
    }, 100);

    return () => clearTimeout(timer);
  }, [proceedToNextRound, sessionFinished, sessionStarted, timeLeftMs]);

  if (!isReady || !profile?.name) {
    return null;
  }

  const loreHeader = getLoreHeader(profile.role, profile.environment);
  const chapter = getPerformanceChapter(insight, canCreateMissions);

  function resetGame() {
    setRound(1);
    setScore(0);
    setTargetIndex(randomIndex());
    setTimeLeftMs(ROUND_MS);
    setSessionStarted(false);
    setSessionFinished(false);
    setFeedback('Inicie o treino e toque rapidamente no bloco azul destacado.');
    setSessionSummary(null);
    setFinalFocusScore(0);
  }

  function startGame() {
    setRound(1);
    setScore(0);
    setTargetIndex(randomIndex());
    setTimeLeftMs(ROUND_MS);
    setSessionStarted(true);
    setSessionFinished(false);
    setFeedback('Toque no bloco azul antes do tempo acabar.');
    setSessionSummary(null);
    setFinalFocusScore(0);
  }

  function handleTilePress(index: number) {
    if (!sessionStarted || sessionFinished) {
      return;
    }

    if (index === targetIndex) {
      proceedToNextRound(true);
      return;
    }

    setFeedback('Esse nao era o bloco certo. Reforce a atencao na proxima rodada.');
    if (round >= TOTAL_ROUNDS) {
      finishSession(score);
      return;
    }

    setRound((current) => current + 1);
    setTargetIndex(randomIndex());
    setTimeLeftMs(Math.max(900, ROUND_MS - round * 70));
  }

  const progressPercent = Math.round((timeLeftMs / ROUND_MS) * 100);

  return (
    <LifeQuestBackground>
      <SafeAreaView style={styles.container}>
        <LifeQuestMenu currentRoute="arena" />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.kicker}>FOCO</Text>
          <Text style={styles.title} testID="arena-title">Treino rapido de concentracao</Text>
          <Text style={styles.subtitle}>
            Um modulo curto para aliviar a tensao, recuperar atencao e gerar LQ extra sem alterar a
            regra automatica de XP das missoes.
          </Text>

          <View style={styles.storyCard}>
            <Text style={styles.storyEyebrow}>MODULO DE BEM-ESTAR</Text>
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
                <MaterialIcons color={lifeQuestTheme.colors.text} name="timer" size={18} />
                <Text style={styles.heroBadgeText}>{round}/{TOTAL_ROUNDS} rodadas</Text>
              </View>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Acertos</Text>
                <Text style={styles.metricValue}>{score}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Tempo da rodada</Text>
                <Text style={styles.metricValue}>{(timeLeftMs / 1000).toFixed(1)}s</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>LQ extra</Text>
                <Text style={styles.metricValue}>{wellness?.totalRewardLq ?? 0}</Text>
              </View>
            </View>
          </View>

          <View style={styles.gameCard} testID="arena-game-card">
            <View style={styles.gameTopRow}>
              <View>
                <Text style={styles.sectionTitle}>Teste de resposta</Text>
                <Text style={styles.sectionHint}>
                  Toque no bloco azul antes do tempo terminar.
                </Text>
              </View>
              <View style={styles.roundBadge}>
                <Text style={styles.roundBadgeText}>Foco {insight?.focusIndex ?? 0}%</Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.max(6, progressPercent)}%` }]} />
            </View>

            <View style={styles.grid}>
              {Array.from({ length: GRID_SIZE }, (_, index) => {
                const isTarget = sessionStarted && !sessionFinished && targetIndex === index;

                return (
                  <Pressable
                    key={index}
                    disabled={!sessionStarted || sessionFinished}
                    onPress={() => handleTilePress(index)}
                    style={({ pressed }) => [
                      styles.tile,
                      isTarget && styles.tileTarget,
                      (!sessionStarted || sessionFinished) && styles.tileDisabled,
                      pressed && sessionStarted && !sessionFinished && styles.buttonPressed,
                    ]}
                    testID={`focus-tile-${index}`}>
                    <MaterialIcons
                      color={isTarget ? lifeQuestTheme.colors.text : lifeQuestTheme.colors.muted}
                      name={isTarget ? 'bolt' : 'grid-view'}
                      size={24}
                    />
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.feedbackText}>{feedback}</Text>

            <View style={styles.actionRow}>
              {!sessionStarted && !sessionFinished ? (
                <Pressable
                  onPress={startGame}
                  testID="arena-start-button"
                  style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
                  <Text style={styles.primaryButtonText}>Iniciar treino</Text>
                </Pressable>
              ) : null}

              {sessionFinished ? (
                <>
                  <Pressable
                    onPress={startGame}
                    style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
                    <Text style={styles.primaryButtonText}>Treinar novamente</Text>
                  </Pressable>
                  <Pressable
                    onPress={resetGame}
                    style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}>
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
                A pontuacao final convertida foi de {finalFocusScore} em 10, com {sessionSummary.rewardLq} LQ extras e aumento de {sessionSummary.focusGain} pontos no indicador de foco.
              </Text>
              <Text style={styles.resultLore}>{getRankLore(sessionSummary.rank)}</Text>
            </View>
          ) : null}

          <View style={styles.historyCard}>
            <Text style={styles.sectionTitle}>Historico recente</Text>
            {recentSessions.length === 0 ? (
              <Text style={styles.historyEmpty}>
                Sua primeira sessao de foco vai aparecer aqui com horario, pontuacao e recompensa.
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
                    <Text style={styles.historyBadge}>{session.score}/10</Text>
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
  content: { paddingHorizontal: 24, paddingTop: 86, paddingBottom: 42 },
  kicker: { color: lifeQuestTheme.colors.accent, fontSize: 12, fontWeight: '800', marginBottom: 10 },
  title: { color: lifeQuestTheme.colors.text, fontSize: 32, fontWeight: '800', lineHeight: 40, marginBottom: 8, paddingRight: 56 },
  subtitle: { color: lifeQuestTheme.colors.muted, fontSize: 15, lineHeight: 23, marginBottom: 20 },
  storyCard: { backgroundColor: '#1C2531', borderRadius: 24, marginBottom: 18, padding: 18 },
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
  heroBadge: { alignItems: 'center', backgroundColor: lifeQuestTheme.colors.accentSoft, borderRadius: 999, flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingVertical: 10 },
  heroBadgeText: { color: lifeQuestTheme.colors.text, fontSize: 12, fontWeight: '800' },
  metricRow: { flexDirection: 'row', gap: 10 },
  metricCard: { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: lifeQuestTheme.colors.cardBorder, borderRadius: 20, borderWidth: 1, flex: 1, padding: 14 },
  metricLabel: { color: lifeQuestTheme.colors.muted, fontSize: 12, fontWeight: '700', marginBottom: 8 },
  metricValue: { color: lifeQuestTheme.colors.text, fontSize: 22, fontWeight: '800' },
  gameCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: lifeQuestTheme.colors.cardBorder, borderRadius: 28, borderWidth: 1, marginBottom: 18, padding: 20 },
  gameTopRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitle: { color: lifeQuestTheme.colors.text, fontSize: 19, fontWeight: '800', marginBottom: 6 },
  sectionHint: { color: lifeQuestTheme.colors.muted, fontSize: 13, fontWeight: '600' },
  roundBadge: { backgroundColor: lifeQuestTheme.colors.successSoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  roundBadgeText: { color: lifeQuestTheme.colors.success, fontSize: 13, fontWeight: '800' },
  progressTrack: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 999, height: 10, marginBottom: 18, overflow: 'hidden' },
  progressFill: { backgroundColor: lifeQuestTheme.colors.accent, height: '100%' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  tile: { alignItems: 'center', backgroundColor: lifeQuestTheme.colors.card, borderRadius: 20, height: 92, justifyContent: 'center', width: '31%' },
  tileTarget: { backgroundColor: 'rgba(92,141,255,0.55)', borderColor: 'rgba(92,141,255,0.85)', borderWidth: 1 },
  tileDisabled: { opacity: 0.9 },
  feedbackText: { color: lifeQuestTheme.colors.muted, fontSize: 14, lineHeight: 21, marginBottom: 14, textAlign: 'center' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  primaryButton: { alignItems: 'center', backgroundColor: lifeQuestTheme.colors.accent, borderRadius: 18, flex: 1, justifyContent: 'center', minHeight: 52, paddingHorizontal: 16 },
  secondaryButton: { alignItems: 'center', backgroundColor: lifeQuestTheme.colors.card, borderRadius: 18, flex: 1, justifyContent: 'center', minHeight: 52, paddingHorizontal: 16 },
  primaryButtonText: { color: lifeQuestTheme.colors.text, fontSize: 15, fontWeight: '800' },
  secondaryButtonText: { color: lifeQuestTheme.colors.text, fontSize: 15, fontWeight: '800' },
  resultCard: { backgroundColor: 'rgba(45,216,129,0.10)', borderColor: 'rgba(45,216,129,0.26)', borderRadius: 26, borderWidth: 1, marginBottom: 18, padding: 20 },
  resultHeadline: { color: lifeQuestTheme.colors.text, fontSize: 22, fontWeight: '800', marginBottom: 8 },
  resultBody: { color: lifeQuestTheme.colors.muted, fontSize: 14, lineHeight: 22 },
  resultLore: { color: lifeQuestTheme.colors.text, fontSize: 13, lineHeight: 20, marginTop: 10, opacity: 0.9 },
  historyCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: lifeQuestTheme.colors.cardBorder, borderRadius: 26, borderWidth: 1, padding: 20 },
  historyEmpty: { color: lifeQuestTheme.colors.muted, fontSize: 14, lineHeight: 21 },
  historyRow: { alignItems: 'center', borderTopColor: lifeQuestTheme.colors.line, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14 },
  historyTitle: { color: lifeQuestTheme.colors.text, fontSize: 15, fontWeight: '800', marginBottom: 4 },
  historyDate: { color: lifeQuestTheme.colors.muted, fontSize: 12, fontWeight: '600' },
  historyValues: { alignItems: 'flex-end', gap: 6 },
  historyBadge: { color: lifeQuestTheme.colors.text, fontSize: 12, fontWeight: '800', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 6 },
  buttonPressed: { opacity: 0.88 },
});
