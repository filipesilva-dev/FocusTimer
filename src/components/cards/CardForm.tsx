import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Card, DadosCard, Dificuldade } from '../../types/cards';
import { validarCard } from '../../utils/validacao';
import { colors } from '../../theme/colors';
import { formStyles as styles } from './formStyles';

type Props = {
  card: Card | null;
  onCancelar: () => void;
  onSalvar: (dados: DadosCard) => Promise<void>;
  onOcupado: (ocupado: boolean) => void;
};

const NIVEIS: { valor: Dificuldade; texto: string }[] = [
  { valor: 'facil', texto: 'Fácil' },
  { valor: 'medio', texto: 'Médio' },
  { valor: 'dificil', texto: 'Difícil' },
];

export default function CardForm({ card, onCancelar, onSalvar, onOcupado }: Props) {
  const [pergunta, setPergunta] = useState(card?.pergunta ?? '');
  const [resposta, setResposta] = useState(card?.resposta ?? '');
  const [dificuldade, setDificuldade] = useState<Dificuldade>(card?.dificuldade ?? 'medio');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const envioEmAndamento = useRef(false);

  async function salvar() {
    if (envioEmAndamento.current) return;
    envioEmAndamento.current = true;
    onOcupado(true);
    setSalvando(true);
    setErro('');
    let salvo = false;
    try {
      await onSalvar(validarCard({ pergunta, resposta, dificuldade }));
      salvo = true;
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível salvar o flashcard.');
    } finally {
      envioEmAndamento.current = false;
      onOcupado(false);
      setSalvando(false);
    }
    if (salvo) onCancelar();
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo} accessibilityRole="header">{card ? 'Editar flashcard' : 'Novo flashcard'}</Text>
        <Text style={styles.label}>Pergunta (até 500 caracteres)</Text>
        <TextInput value={pergunta} onChangeText={setPergunta} editable={!salvando}
          accessibilityLabel="Pergunta do flashcard" placeholder="O que você quer lembrar?"
          placeholderTextColor={colors.textMuted} multiline textAlignVertical="top"
          style={[styles.campo, styles.descricao]} />
        <Text style={styles.label}>Resposta (até 500 caracteres)</Text>
        <TextInput value={resposta} onChangeText={setResposta} editable={!salvando}
          accessibilityLabel="Resposta do flashcard" placeholder="Escreva a resposta"
          placeholderTextColor={colors.textMuted} multiline textAlignVertical="top"
          style={[styles.campo, styles.descricao]} />
        <Text style={styles.label}>Dificuldade</Text>
        <View style={locais.niveis}>
          {NIVEIS.map((nivel) => (
            <Pressable key={nivel.valor} onPress={() => setDificuldade(nivel.valor)} disabled={salvando}
              accessibilityRole="button" accessibilityLabel={`Dificuldade ${nivel.texto}`}
              accessibilityState={{ selected: dificuldade === nivel.valor, disabled: salvando }}
              style={[styles.botao, dificuldade === nivel.valor ? styles.salvar : styles.cancelar,
                salvando && styles.desabilitado]}>
              <Text style={dificuldade === nivel.valor ? styles.textoSalvar : styles.textoCancelar}>{nivel.texto}</Text>
            </Pressable>
          ))}
        </View>
        {erro ? <Text style={styles.erro} accessibilityRole="alert">{erro}</Text> : null}
        <View style={styles.acoes}>
          <Pressable onPress={() => { if (!envioEmAndamento.current) onCancelar(); }} disabled={salvando}
            accessibilityRole="button" accessibilityLabel="Cancelar edição do flashcard"
            accessibilityState={{ disabled: salvando }}
            style={[styles.botao, styles.cancelar, salvando && styles.desabilitado]}>
            <Text style={styles.textoCancelar}>Cancelar</Text>
          </Pressable>
          <Pressable onPress={salvar} disabled={salvando} accessibilityRole="button"
            accessibilityLabel="Salvar flashcard" accessibilityState={{ disabled: salvando, busy: salvando }}
            style={[styles.botao, styles.salvar, salvando && styles.desabilitado]}>
            <Text style={styles.textoSalvar}>{salvando ? 'Salvando…' : 'Salvar'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const locais = StyleSheet.create({
  niveis: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
});
