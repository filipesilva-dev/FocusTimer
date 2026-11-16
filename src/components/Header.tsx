import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

type HeaderProps = { subtitle: string; showBack?: boolean };

export default function Header({ subtitle, showBack = false }: HeaderProps) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.side}>
        {showBack && (
          <Pressable onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('Timer'); // fallback de segurança
              }
            }} style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
        )}
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>FocusTimer</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.side}>
        {!showBack && (
          <Pressable onPress={() => navigation.navigate('Configuracoes')} style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="settings-outline" size={22} color={colors.white} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.primaryDark, flexDirection: 'row', alignItems: 'center', paddingBottom: 14, paddingHorizontal: 16 },
  side: { width: 48, alignItems: 'center', justifyContent: 'center' },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  titleContainer: { flex: 1, alignItems: 'center' },
  title: { color: colors.white, fontSize: 18, fontWeight: '800' },
  subtitle: { color: colors.primaryTint, fontSize: 11, marginTop: 2, fontWeight: '500' },
});
