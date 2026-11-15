import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const formStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primaryDark },
  container: { flex: 1, backgroundColor: colors.primaryBg },
  conteudo: { padding: 20, paddingBottom: 32 },
  titulo: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 24 },
  label: { fontSize: 14, color: colors.text, fontWeight: '600', marginBottom: 8 },
  campo: { backgroundColor: colors.white, color: colors.text, borderWidth: 1,
    borderColor: colors.border, borderRadius: 12, padding: 14, minHeight: 48,
    fontSize: 16, marginBottom: 20 },
  descricao: { minHeight: 120 },
  erro: { color: '#B91C1C', marginBottom: 16, lineHeight: 21 },
  acoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  botao: { flexGrow: 1, minHeight: 48, padding: 14, alignItems: 'center',
    justifyContent: 'center', borderRadius: 12 },
  cancelar: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  salvar: { backgroundColor: colors.primaryDark },
  textoCancelar: { color: colors.primaryDarker, fontWeight: '700' },
  textoSalvar: { color: colors.white, fontWeight: '700' },
  desabilitado: { opacity: 0.5 },
});
