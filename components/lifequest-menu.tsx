import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { lifeQuestTheme } from '@/constants/lifequest-theme';
import { lifeQuestTypography } from '@/constants/lifequest-typography';

type LifeQuestMenuProps = {
  currentRoute: 'index' | 'explore' | 'validations' | 'rewards' | 'profile' | 'arena';
  onLogout?: () => void;
};

const menuItems = [
  { key: 'index', label: 'Painel', icon: 'space-dashboard' },
  { key: 'explore', label: 'Missoes', icon: 'task-alt' },
  { key: 'validations', label: 'Validacoes', icon: 'verified' },
  { key: 'rewards', label: 'Recompensas', icon: 'workspace-premium' },
  { key: 'profile', label: 'Perfil', icon: 'person' },
  { key: 'arena', label: 'Foco', icon: 'sports-esports' },
] as const;

function getRoutePath(routeKey: LifeQuestMenuProps['currentRoute']) {
  if (routeKey === 'index') {
    return '/(tabs)';
  }

  return `/(tabs)/${routeKey}`;
}

export function LifeQuestMenu({ currentRoute, onLogout }: LifeQuestMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityLabel="Abrir menu principal"
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
        testID="hamburger-menu-button">
        <MaterialIcons color={lifeQuestTheme.colors.text} name="menu" size={24} />
      </Pressable>

      <Modal animationType="fade" onRequestClose={() => setOpen(false)} transparent visible={open}>
        <View style={styles.overlay}>
          <Pressable onPress={() => setOpen(false)} style={StyleSheet.absoluteFill} />
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.kicker}>NAVEGACAO</Text>
              <Pressable
                onPress={() => setOpen(false)}
                style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}>
                <MaterialIcons color={lifeQuestTheme.colors.text} name="close" size={20} />
              </Pressable>
            </View>

            {menuItems.map((item) => {
              const selected = item.key === currentRoute;
              return (
                <Pressable
                  key={item.key}
                  onPress={() => {
                    setOpen(false);
                    router.push(getRoutePath(item.key) as never);
                  }}
                  style={({ pressed }) => [
                    styles.item,
                    selected && styles.itemSelected,
                    pressed && styles.pressed,
                  ]}
                  testID={`menu-item-${item.key}`}>
                  <View style={styles.itemLeft}>
                    <MaterialIcons
                      color={selected ? lifeQuestTheme.colors.accent : lifeQuestTheme.colors.text}
                      name={item.icon}
                      size={22}
                    />
                    <Text style={[styles.itemText, selected && styles.itemTextSelected]}>
                      {item.label}
                    </Text>
                  </View>
                  {selected ? <Text style={styles.currentTag}>Atual</Text> : null}
                </Pressable>
              );
            })}

            {onLogout ? (
              <Pressable
                onPress={() => {
                  setOpen(false);
                  onLogout();
                }}
                style={({ pressed }) => [styles.logoutItem, pressed && styles.pressed]}
                testID="menu-logout-button">
                <MaterialIcons color={lifeQuestTheme.colors.danger} name="logout" size={20} />
                <Text style={styles.logoutText}>Sair da conta</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    alignItems: 'center',
    backgroundColor: 'rgba(11, 16, 24, 0.92)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 18,
    borderWidth: 1,
    height: 52,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    top: 18,
    width: 52,
    zIndex: 50,
  },
  overlay: {
    backgroundColor: 'rgba(4, 8, 15, 0.6)',
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 78,
  },
  card: {
    alignSelf: 'flex-end',
    backgroundColor: '#151B24',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 28,
    borderWidth: 1,
    minWidth: 250,
    padding: 18,
    width: '82%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  kicker: {
    ...lifeQuestTypography.kicker,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  item: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  itemSelected: {
    backgroundColor: 'rgba(92, 141, 255, 0.14)',
    borderColor: 'rgba(92, 141, 255, 0.28)',
    borderWidth: 1,
  },
  itemLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  itemText: {
    color: lifeQuestTheme.colors.text,
    fontFamily: lifeQuestTheme.fonts.title,
    fontSize: 15,
  },
  itemTextSelected: {
    color: lifeQuestTheme.colors.accent,
  },
  currentTag: {
    color: lifeQuestTheme.colors.accent,
    fontFamily: lifeQuestTheme.fonts.label,
    fontSize: 12,
  },
  logoutItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  logoutText: {
    color: lifeQuestTheme.colors.text,
    fontFamily: lifeQuestTheme.fonts.title,
    fontSize: 14,
  },
  pressed: {
    opacity: 0.86,
  },
});
