import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Card, Dificuldade } from '../../types/cards';
import { colors } from '../../theme/colors';

type Props = {
  card: Card;
  desabilitado: boolean;
  onEditar: () => void;
  onExcluir: () => void;
};

const NIVEIS: Record<Dificuldade, string> = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };

export default function CardItem({ card, desabilitado, onEditar, onExcluir }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.nivel}>Dificuldade: {NIVEIS[card.dificuldade]}</Text>
      <Text style={styles.label}>Pergunta</Text>
      <Text style={styles.pergunta} numberOfLines={3}>{card.pergunta}</Text>
      <Text style={styles.label}>Resposta</Text>
      <Text style={styles.resposta} numberOfLines={3}>{card.resposta}</Text>
      <View style={styles.acoes}>
        <Pressable onPress={onEditar} disabled={desabilitado} accessibilityRole="button"
          accessibilityLabel={`Editar flashcard: ${card.pergunta}`}
          accessibilityState={{ disabled: desabilitado }}
          style={[styles.botao, desabilitado && styles.desabilitado]}>
          <Text style={styles.editar}>Editar</Text>
        </Pressable>
        <Pressable onPress={onExcluir} disabled={desabilitado} accessibilityRole="button"
          accessibilityLabel={`Excluir flashcard: ${card.pergunta}`}
          accessibilityState={{ disabled: desabilitado }}
          style={[styles.botao, desabilitado && styles.desabilitado]}>
          <Text style={styles.excluir}>Excluir</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  nivel: { color: colors.primaryDarker, fontSize: 15, lineHeight: 23, fontWeight: '600', marginBottom: 12 },
  label: { color: colors.textMuted, fontSize: 14, lineHeight: 22, marginTop: 8, marginBottom: 6 },
  pergunta: { color: colors.text, fontSize: 20, fontWeight: '600', lineHeight: 29 },
  resposta: { color: colors.text, fontSize: 18, lineHeight: 27 },
  acoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  botao: { flexGrow: 1, minHeight: 52, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center',
    borderRadius: 10, backgroundColor: colors.primaryBg },
  editar: { color: colors.primaryDarker, fontSize: 16, lineHeight: 24, fontWeight: '600' },
  excluir: { color: '#B91C1C', fontSize: 16, lineHeight: 24, fontWeight: '600' },
  desabilitado: { opacity: 0.5 },
});
