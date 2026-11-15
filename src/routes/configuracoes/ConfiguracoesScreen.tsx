import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import { colors } from '../../theme/colors';

export default function ConfiguracoesScreen() {
  return (
    <View style={styles.container}>
      <Header subtitle="Configurações" showBack />
      <View style={styles.body}><Text style={styles.text}>Teste configuração</Text></View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primaryBg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18, fontWeight: '700', color: colors.text },
});
