import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { lifeQuestTheme } from '@/constants/lifequest-theme';

type Props = {
  children: ReactNode;
  style?: ViewStyle;
};

export function LifeQuestBackground({ children, style }: Props) {
  return (
    <LinearGradient colors={lifeQuestTheme.gradient} style={[styles.container, style]}>
      <LinearGradient colors={['rgba(92,141,255,0.18)', 'transparent']} style={styles.glowTop} />
      <LinearGradient colors={['rgba(45,216,129,0.10)', 'transparent']} style={styles.glowBottom} />
      <View style={[styles.ring, styles.ringTopLeft]} />
      <View style={[styles.ring, styles.ringTopRight]} />
      <View style={[styles.ring, styles.ringBottomRight]} />
      <View style={styles.grid} />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lifeQuestTheme.colors.background,
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: -80,
    right: -30,
    width: 260,
    height: 220,
    borderRadius: 220,
    opacity: 0.8,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -120,
    left: -50,
    width: 280,
    height: 240,
    borderRadius: 240,
    opacity: 0.7,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 999,
  },
  ringTopLeft: {
    width: 160,
    height: 160,
    top: -90,
    left: -60,
  },
  ringTopRight: {
    width: 180,
    height: 180,
    top: -70,
    right: -80,
  },
  ringBottomRight: {
    width: 220,
    height: 220,
    bottom: -120,
    right: -120,
  },
  grid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
    backgroundColor: 'transparent',
    borderLeftWidth: 0,
  },
});
