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
      <View style={[styles.ring, styles.ringTopLeft]} />
      <View style={[styles.ring, styles.ringTopRight]} />
      <View style={[styles.ring, styles.ringBottomRight]} />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lifeQuestTheme.colors.background,
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
});
