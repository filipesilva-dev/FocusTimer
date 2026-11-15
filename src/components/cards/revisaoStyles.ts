import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const revisaoStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primaryBg },
  conteudo: { padding: 20, paddingBottom: 32 },
  titulo: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 16 },
  texto: { fontSize: 15, color: colors.text, lineHeight: 23, marginBottom: 12 },
  label: { color: colors.textMuted, fontWeight: '600', marginBottom: 8 },
  grupo: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  botao: { minHeight: 48, padding: 14, borderRadius: 12, alignItems: 'center',
    justifyContent: 'center', backgroundColor: colors.primaryDark, marginBottom: 12 },
  opcao: { flexGrow: 1, minWidth: 96, marginBottom: 0, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border },
  selecionada: { backgroundColor: colors.primaryDark },
  textoBotao: { color: colors.white, fontWeight: '700', textAlign: 'center' },
  textoOpcao: { color: colors.primaryDarker, fontWeight: '600', textAlign: 'center' },
  cartao: { padding: 18, borderRadius: 16, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  pergunta: { fontSize: 20, lineHeight: 29, color: colors.text, fontWeight: '600' },
  resposta: { fontSize: 18, lineHeight: 27, color: colors.text },
  erro: { color: '#B91C1C', lineHeight: 22, marginBottom: 16 },
  desabilitado: { opacity: 0.5 },
});
