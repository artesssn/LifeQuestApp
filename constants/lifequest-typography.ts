import { lifeQuestTheme } from '@/constants/lifequest-theme';

export const lifeQuestTypography = {
  kicker: {
    color: lifeQuestTheme.colors.accent,
    fontFamily: lifeQuestTheme.fonts.label,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
  heroTitle: {
    color: lifeQuestTheme.colors.text,
    fontFamily: lifeQuestTheme.fonts.display,
    fontSize: 38,
    lineHeight: 44,
  },
  sectionTitle: {
    color: lifeQuestTheme.colors.text,
    fontFamily: lifeQuestTheme.fonts.heading,
    fontSize: 22,
    lineHeight: 28,
  },
  cardTitle: {
    color: lifeQuestTheme.colors.text,
    fontFamily: lifeQuestTheme.fonts.title,
    fontSize: 18,
    lineHeight: 24,
  },
  body: {
    color: lifeQuestTheme.colors.muted,
    fontFamily: lifeQuestTheme.fonts.body,
    fontSize: 15,
    lineHeight: 23,
  },
  bodyStrong: {
    color: lifeQuestTheme.colors.text,
    fontFamily: lifeQuestTheme.fonts.bodyStrong,
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    color: lifeQuestTheme.colors.text,
    fontFamily: lifeQuestTheme.fonts.label,
    fontSize: 13,
    lineHeight: 18,
  },
};
