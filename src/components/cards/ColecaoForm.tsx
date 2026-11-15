import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Colecao, DadosColecao } from '../../types/cards';
import { validarColecao } from '../../utils/validacao';
import { colors } from '../../theme/colors';

type Props = {
  colecao: Colecao | null;
  onCancelar: () => void;
  onSalvar: (dados: DadosColecao) => Promise<void>;
};

export default function ColecaoForm({ colecao, onCancelar, onSalvar }: Props) {
  const [nome, setNome] = useState(colecao?.nome ?? '');
  const [descricao, setDescricao] = useState(colecao?.descricao ?? '');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const envioEmAndamento = useRef(false);

  function cancelar() {
    if (!envioEmAndamento.current) onCancelar();
  }

  async function salvar() {
    if (envioEmAndamento.current) return;
    envioEmAndamento.current = true;
    setSalvando(true);
    setErro('');
    let salva = false;
    try {
      const dados = validarColecao({ nome, descricao });
      await onSalvar(dados);
      salva = true;
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível salvar a coleção.');
    } finally {
      envioEmAndamento.current = false;
      setSalvando(false);
    }
    if (salva) onCancelar();
  }

  return (
    <Modal visible animationType="slide" onRequestClose={cancelar}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
            <Text style={styles.titulo} accessibilityRole="header">
              {colecao ? 'Editar coleção' : 'Nova coleção'}
            </Text>
            <Text style={styles.label}>Nome (até 60 caracteres)</Text>
            <TextInput value={nome} onChangeText={setNome} editable={!salvando}
              placeholder="Ex.: Biologia" placeholderTextColor={colors.textMuted}
              accessibilityLabel="Nome da coleção" style={styles.campo} autoCapitalize="sentences" />
            <Text style={styles.label}>Descrição opcional (até 200 caracteres)</Text>
            <TextInput value={descricao} onChangeText={setDescricao} editable={!salvando}
              placeholder="O que você vai estudar?" placeholderTextColor={colors.textMuted}
              accessibilityLabel="Descrição da coleção" multiline textAlignVertical="top"
              style={[styles.campo, styles.descricao]} />
            {erro ? <Text style={styles.erro} accessibilityRole="alert">{erro}</Text> : null}
            <View style={styles.acoes}>
              <Pressable onPress={cancelar} disabled={salvando} accessibilityRole="button"
                accessibilityLabel="Cancelar edição da coleção" accessibilityState={{ disabled: salvando }}
                style={[styles.botao, styles.cancelar, salvando && styles.desabilitado]}>
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={salvar} disabled={salvando} accessibilityRole="button"
                accessibilityLabel="Salvar coleção" accessibilityState={{ disabled: salvando, busy: salvando }}
                style={[styles.botao, styles.salvar, salvando && styles.desabilitado]}>
                <Text style={styles.textoSalvar}>{salvando ? 'Salvando…' : 'Salvar'}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
