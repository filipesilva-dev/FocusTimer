import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const TAB_CONFIG: Record<string, { label: string; icon: string; iconFocused: string }> = {
  Cards:  { label: 'Cards',  icon: 'albums-outline',   iconFocused: 'albums' },
  Timer:  { label: 'Timer',  icon: 'timer-outline',    iconFocused: 'timer' },
  Agenda: { label: 'Agenda', icon: 'calendar-outline', iconFocused: 'calendar' },
};

export default function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const visible = state.routes.filter((r: any) => TAB_CONFIG[r.name]);

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {visible.map((route: any) => {
        const realIndex = state.routes.indexOf(route);
        const isFocused = state.index === realIndex;
        const cfg = TAB_CONFIG[route.name];

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tab} hitSlop={6}>
            <Ionicons name={(isFocused ? cfg.iconFocused : cfg.icon) as any} size={22} color={isFocused ? colors.primary : colors.textMuted} />
            <Text numberOfLines={1} allowFontScaling={false} style={[styles.label, { color: isFocused ? colors.primary : colors.textMuted }, isFocused && styles.labelActive]}>
              {cfg.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8, paddingHorizontal: 4, ...Platform.select({ android: { elevation: 8 }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 4 } }) },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, minHeight: 52, gap: 2 },
  label: { fontSize: 11, fontWeight: '500', textAlign: 'center' },
  labelActive: { fontWeight: '700' },
});
