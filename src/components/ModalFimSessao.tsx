import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  visible: boolean; carregando: boolean; frase: string; titulo: string; emoji: string;
  proximoLabel: string; onContinuar: () => void; onParar: () => void;
};

export default function ModalFimSessao({ visible, carregando, frase, titulo, emoji, proximoLabel, onContinuar, onParar }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onParar}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.titulo}>{titulo}</Text>
          {carregando ? (
            <View style={styles.carregandoBox}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.carregandoText}>Buscando uma frase pra você…</Text>
            </View>
          ) : (
            <View style={styles.fraseBox}>
              <Text style={styles.frase}>&ldquo;{frase}&rdquo;</Text>
            </View>
          )}
          <View style={styles.proximoBox}>
            <Text style={styles.proximoLabel}>A seguir</Text>
            <Text style={styles.proximoValor}>{proximoLabel}</Text>
          </View>
          <View style={styles.acoes}>
            <Pressable style={styles.botaoParar} onPress={onParar}>
              <Text style={styles.botaoPararText}>Parar aqui</Text>
            </Pressable>
            <Pressable style={styles.botaoContinuar} onPress={onContinuar}>
              <Text style={styles.botaoContinuarText}>Continuar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(6,78,59,0.55)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 420, backgroundColor: colors.white, borderRadius: 24, padding: 24, alignItems: 'center' },
  emoji: { fontSize: 48, marginBottom: 8 },
  titulo: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 16, textAlign: 'center' },
  carregandoBox: { alignItems: 'center', gap: 8, paddingVertical: 24, marginBottom: 8 },
  carregandoText: { fontSize: 13, color: colors.textMuted },
  fraseBox: { backgroundColor: colors.primaryBg, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border, width: '100%' },
  frase: { fontSize: 15, fontStyle: 'italic', color: colors.text, textAlign: 'center', lineHeight: 22 },
  proximoBox: { alignItems: 'center', marginBottom: 20 },
  proximoLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.5, marginBottom: 4, textTransform: 'uppercase' },
  proximoValor: { fontSize: 15, fontWeight: '700', color: colors.primary },
  acoes: { flexDirection: 'row', gap: 12, width: '100%' },
  botaoParar: { flex: 1, paddingVertical: 14, borderRadius: 24, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', backgroundColor: colors.white },
  botaoPararText: { fontSize: 14, fontWeight: '700', color: colors.textMuted },
  botaoContinuar: { flex: 1, paddingVertical: 14, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center' },
  botaoContinuarText: { fontSize: 14, fontWeight: '700', color: colors.white },
});
