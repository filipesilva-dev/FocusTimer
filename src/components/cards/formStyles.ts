import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const formStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primaryBg },
  container: { flex: 1, backgroundColor: colors.primaryBg },
  conteudo: { flexGrow: 1, width: '100%', maxWidth: 960, alignSelf: 'center',
    padding: 20, paddingBottom: 24 },
  conteudoColecao: { maxWidth: 680, justifyContent: 'center' },
  titulo: { fontSize: 28, lineHeight: 36, fontWeight: '700', color: colors.text, marginBottom: 28 },
  label: { fontSize: 16, lineHeight: 24, color: colors.text, fontWeight: '600', marginBottom: 8 },
  campo: { backgroundColor: colors.white, color: colors.text, borderWidth: 1,
    borderColor: colors.border, borderRadius: 12, padding: 16, minHeight: 60,
    fontSize: 18, lineHeight: 28, marginBottom: 20 },
  grupoExpansivel: { flexGrow: 1 },
  descricao: { minHeight: 160 },
  campoExpansivel: { flexGrow: 1 },
  descricaoColecao: { height: 160, minHeight: 160 },
  erro: { color: '#B91C1C', marginBottom: 16, lineHeight: 21 },
  acoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingTop: 8 },
  botao: { flexGrow: 1, minHeight: 56, padding: 16, alignItems: 'center',
    justifyContent: 'center', borderRadius: 12 },
  cancelar: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  salvar: { backgroundColor: colors.primaryDark },
  textoCancelar: { color: colors.primaryDarker, fontSize: 16, lineHeight: 24, fontWeight: '700' },
  textoSalvar: { color: colors.white, fontSize: 16, lineHeight: 24, fontWeight: '700' },
  desabilitado: { opacity: 0.5 },
});
