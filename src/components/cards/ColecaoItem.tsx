import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Colecao } from '../../types/cards';
import { colors } from '../../theme/colors';

type Props = {
  colecao: Colecao;
  desabilitado: boolean;
  onEditar: () => void;
  onExcluir: () => void;
};

export default function ColecaoItem({ colecao, desabilitado, onEditar, onExcluir }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.nome} accessibilityRole="header">{colecao.nome}</Text>
      {colecao.descricao ? <Text style={styles.descricao}>{colecao.descricao}</Text> : null}
      <Text style={styles.contagem}>
        {colecao.totalCards} {colecao.totalCards === 1 ? 'card' : 'cards'}
      </Text>
      <View style={styles.acoes}>
        <Pressable onPress={onEditar} disabled={desabilitado}
          accessibilityRole="button" accessibilityLabel={`Editar coleção ${colecao.nome}`}
          accessibilityState={{ disabled: desabilitado }}
          style={[styles.botao, desabilitado && styles.desabilitado]}>
          <Text style={styles.editar}>Editar</Text>
        </Pressable>
        <Pressable onPress={onExcluir} disabled={desabilitado}
          accessibilityRole="button" accessibilityLabel={`Excluir coleção ${colecao.nome}`}
          accessibilityState={{ disabled: desabilitado }}
          style={[styles.botao, desabilitado && styles.desabilitado]}>
          <Text style={styles.excluir}>Excluir</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: colors.border },
  nome: { fontSize: 18, fontWeight: '700', color: colors.text },
  descricao: { color: colors.textMuted, marginTop: 8, lineHeight: 21 },
  contagem: { color: colors.textMuted, marginTop: 10, fontSize: 13 },
  acoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  botao: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12,
    borderRadius: 10, backgroundColor: colors.primaryBg },
  editar: { color: colors.primaryDarker, fontWeight: '600' },
  excluir: { color: '#B91C1C', fontWeight: '600' },
  desabilitado: { opacity: 0.5 },
});
