import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Colecao } from '../../types/cards';
import { colors } from '../../theme/colors';

type Props = {
  colecao: Colecao;
  desabilitado: boolean;
  onAbrir: () => void;
  onEditar: () => void;
  onExcluir: () => void;
};

export default function ColecaoItem({ colecao, desabilitado, onAbrir, onEditar, onExcluir }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.nome} accessibilityRole="header">{colecao.nome}</Text>
      {colecao.descricao ? <Text style={styles.descricao}>{colecao.descricao}</Text> : null}
      <Text style={styles.contagem}>
        {colecao.totalCards} {colecao.totalCards === 1 ? 'card' : 'cards'}
      </Text>
      <View style={styles.acoes}>
        <Pressable onPress={onAbrir} disabled={desabilitado}
          accessibilityRole="button" accessibilityLabel={`Abrir flashcards da coleção ${colecao.nome}`}
          accessibilityState={{ disabled: desabilitado }}
          style={[styles.botao, desabilitado && styles.desabilitado]}>
          <Text style={styles.editar}>Abrir</Text>
        </Pressable>
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
  container: { backgroundColor: colors.white, borderRadius: 16, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: colors.border },
  nome: { fontSize: 22, lineHeight: 30, fontWeight: '700', color: colors.text },
  descricao: { color: colors.textMuted, fontSize: 16, marginTop: 12, lineHeight: 24 },
  contagem: { color: colors.textMuted, marginTop: 12, fontSize: 15, lineHeight: 23 },
  acoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  botao: { flexGrow: 1, minHeight: 52, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16,
    borderRadius: 10, backgroundColor: colors.primaryBg },
  editar: { color: colors.primaryDarker, fontSize: 16, lineHeight: 24, fontWeight: '600' },
  excluir: { color: '#B91C1C', fontSize: 16, lineHeight: 24, fontWeight: '600' },
  desabilitado: { opacity: 0.5 },
});
