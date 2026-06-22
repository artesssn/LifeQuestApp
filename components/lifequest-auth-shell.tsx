import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { lifeQuestTheme } from '@/constants/lifequest-theme';
import { lifeQuestTypography } from '@/constants/lifequest-typography';

export function LifeQuestAuthShell({
  kicker,
  title,
  subtitle,
  sideTitle,
  sideBody,
  children,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  sideTitle: string;
  sideBody: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.heroPanel}>
        <Text style={styles.kicker}>{kicker}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.sideCard}>
          <Text style={styles.sideTitle}>{sideTitle}</Text>
          <Text style={styles.sideBody}>{sideBody}</Text>
        </View>
      </View>

      <View style={styles.formPanel}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 18,
  },
  heroPanel: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: lifeQuestTheme.radius.xl,
    borderWidth: 1,
    padding: 24,
  },
  kicker: {
    ...lifeQuestTypography.kicker,
    marginBottom: 12,
  },
  title: {
    ...lifeQuestTypography.heroTitle,
    fontSize: 34,
    lineHeight: 40,
    marginBottom: 10,
  },
  subtitle: {
    ...lifeQuestTypography.body,
    color: lifeQuestTheme.colors.mutedStrong,
    marginBottom: 20,
  },
  sideCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: lifeQuestTheme.radius.md,
    borderWidth: 1,
    padding: 18,
  },
  sideTitle: {
    ...lifeQuestTypography.cardTitle,
    marginBottom: 8,
  },
  sideBody: {
    ...lifeQuestTypography.body,
  },
  formPanel: {
    backgroundColor: lifeQuestTheme.colors.backgroundPanel,
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: lifeQuestTheme.radius.xl,
    borderWidth: 1,
    padding: 20,
  },
});
