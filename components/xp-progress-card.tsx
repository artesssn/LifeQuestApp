import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { lifeQuestTheme } from '@/constants/lifequest-theme';

type Props = {
  currentLevel: number;
  currentLevelXp: number;
  nextLevelXp: number;
  levelProgressPercent: number;
  totalXp: number;
};

export function XpProgressCard({
  currentLevel,
  currentLevelXp,
  nextLevelXp,
  levelProgressPercent,
  totalXp,
}: Props) {
  const widthAnim = useRef(new Animated.Value(levelProgressPercent)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const bannerTranslate = useRef(new Animated.Value(-8)).current;
  const initialized = useRef(false);
  const previousLevel = useRef(currentLevel);
  const previousXp = useRef(totalXp);
  const [levelUpText, setLevelUpText] = useState('');

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: levelProgressPercent,
      duration: 550,
      useNativeDriver: false,
    }).start();
  }, [levelProgressPercent, widthAnim]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      previousLevel.current = currentLevel;
      previousXp.current = totalXp;
      return;
    }

    if (totalXp > previousXp.current) {
      pulseAnim.setValue(0);
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }

    if (currentLevel > previousLevel.current) {
      setLevelUpText(`Subiu para o nivel ${currentLevel}!`);
      bannerOpacity.setValue(0);
      bannerTranslate.setValue(-8);
      Animated.sequence([
        Animated.parallel([
          Animated.timing(bannerOpacity, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(bannerTranslate, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1800),
        Animated.parallel([
          Animated.timing(bannerOpacity, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(bannerTranslate, {
            toValue: -8,
            duration: 220,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }

    previousLevel.current = currentLevel;
    previousXp.current = totalXp;
  }, [bannerOpacity, bannerTranslate, currentLevel, pulseAnim, totalXp]);

  const barWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: pulseScale }] }]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.levelUpBanner,
          { opacity: bannerOpacity, transform: [{ translateY: bannerTranslate }] },
        ]}>
        <Text style={styles.levelUpText}>{levelUpText}</Text>
      </Animated.View>

      <View style={styles.header}>
        <Text style={styles.title}>Nivel {currentLevel}</Text>
        <Text style={styles.meta}>
          {currentLevelXp}/{nextLevelXp} XP
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: barWidth }]} />
      </View>
      <Text style={styles.hint}>
        Cada novo nivel exige mais XP do que o anterior, deixando a subida cada vez mais dificil.
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(92,141,255,0.12)',
    borderColor: 'rgba(92,141,255,0.18)',
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
    padding: 18,
  },
  levelUpBanner: {
    backgroundColor: 'rgba(45,216,129,0.16)',
    borderColor: 'rgba(45,216,129,0.35)',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  levelUpText: {
    color: lifeQuestTheme.colors.success,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    color: lifeQuestTheme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  meta: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  track: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    height: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: lifeQuestTheme.colors.accent,
    borderRadius: 999,
    height: '100%',
  },
  hint: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
});
