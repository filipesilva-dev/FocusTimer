import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, Modal, TextInput, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { Task } from '../../types';
import { createTask } from '../../storage/tasks';

type Props = {
  visible: boolean;
  tarefa: Task | null; // null = tarefa nova
  data: string; // dia selecionado na agenda (AAAA-MM-DD)
  onFechar: () => void;
  onSalvar: (tarefa: Task) => void;
  onExcluir: (id: string) => void;
};

const OPCOES_PRIORIDADE = [
  { valor: 1, label: 'Baixa' },
  { valor: 2, label: 'Média' },
  { valor: 3, label: 'Alta' },
];

export default function TarefaModal({ visible, tarefa, data, onFechar, onSalvar, onExcluir }: Props) {
  const [titulo, setTitulo] = useState('');
  const [materia, setMateria] = useState('');
  const [prioridade, setPrioridade] = useState(2);
  const [pomodoros, setPomodoros] = useState(1);
  const [feitos, setFeitos] = useState(0);
  const [notas, setNotas] = useState('');
  const [erro, setErro] = useState('');
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  // toda vez que abre, preenche com a tarefa (editar) ou limpa (nova)
  useEffect(() => {
    if (!visible) return;
    setTitulo(tarefa ? tarefa.title : '');
    setMateria(tarefa ? tarefa.className : '');
    setPrioridade(tarefa ? tarefa.priority : 2);
    setPomodoros(tarefa ? tarefa.pomodoroAmount : 1);
    setFeitos(tarefa ? tarefa.completedPomodoros : 0);
    setNotas(tarefa ? tarefa.notes : '');
    setErro('');
    setConfirmarExclusao(false);
  }, [visible, tarefa]);

  function mudarPomodoros(delta: number) {
    const novo = Math.max(1, pomodoros + delta);
    setPomodoros(novo);
    if (feitos > novo) setFeitos(novo);
  }

  function mudarFeitos(delta: number) {
    setFeitos(Math.min(pomodoros, Math.max(0, feitos + delta)));
  }

  function salvar() {
    if (titulo.trim() === '') {
      setErro('Digite um título para a tarefa.');
      return;
    }

    const dados = {
      title: titulo.trim(),
      className: materia.trim() || 'Geral',
      priority: prioridade,
      pomodoroAmount: pomodoros,
      completedPomodoros: feitos,
      notes: notas.trim(),
    };

    if (tarefa) {
      onSalvar({ ...tarefa, ...dados, tempoEstudadoMinutos: tarefa.tempoEstudadoMinutos || 0 });
    } else {
      onSalvar(createTask({ ...dados, date: data, status: false, tempoEstudadoMinutos: 0 }));
    }
  }

  function excluir() {
    if (!tarefa) return;
    // primeiro clique pede confirmação, o segundo exclui
    if (!confirmarExclusao) {
      setConfirmarExclusao(true);
      return;
    }
    onExcluir(tarefa.id);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onFechar}>
      <KeyboardAvoidingView
        style={styles.fundo}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.caixa}>
          <View style={styles.header}>
            <Text style={styles.titulo}>{tarefa ? 'Editar tarefa' : 'Nova tarefa'}</Text>
            <Pressable onPress={onFechar} style={styles.botaoFechar} hitSlop={8} accessibilityLabel="Fechar">
              <Ionicons name="close" size={18} color={colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              value={titulo}
              onChangeText={(texto) => {
                setTitulo(texto);
                setErro('');
              }}
              placeholder="Ex: Revisar capítulo 3"
              placeholderTextColor={colors.textLight}
            />
            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

            <Text style={styles.label}>Matéria</Text>
            <TextInput
              style={styles.input}
              value={materia}
              onChangeText={setMateria}
              placeholder="Ex: Matemática"
              placeholderTextColor={colors.textLight}
            />

            <Text style={styles.label}>Prioridade</Text>
            <View style={styles.linhaBotoes}>
              {OPCOES_PRIORIDADE.map((opcao) => (
                <Pressable
                  key={opcao.valor}
                  onPress={() => setPrioridade(opcao.valor)}
                  style={[styles.opcao, prioridade === opcao.valor && styles.opcaoAtiva]}
                >
                  <Text style={[styles.opcaoTexto, prioridade === opcao.valor && styles.opcaoTextoAtivo]}>
                    {opcao.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.linhaBotoes}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Pomodoros planejados</Text>
                <View style={styles.contador}>
                  <Pressable onPress={() => mudarPomodoros(-1)} style={styles.botaoContador} accessibilityLabel="Diminuir pomodoros planejados">
                    <Ionicons name="remove" size={18} color={colors.primaryDark} />
                  </Pressable>
                  <Text style={styles.valorContador}>{pomodoros}</Text>
                  <Pressable onPress={() => mudarPomodoros(1)} style={styles.botaoContador} accessibilityLabel="Aumentar pomodoros planejados">
                    <Ionicons name="add" size={18} color={colors.primaryDark} />
                  </Pressable>
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Feitos</Text>
                <View style={styles.contador}>
                  <Pressable onPress={() => mudarFeitos(-1)} style={styles.botaoContador} accessibilityLabel="Diminuir pomodoros feitos">
                    <Ionicons name="remove" size={18} color={colors.primaryDark} />
                  </Pressable>
                  <Text style={styles.valorContador}>{feitos}</Text>
                  <Pressable onPress={() => mudarFeitos(1)} style={styles.botaoContador} accessibilityLabel="Aumentar pomodoros feitos">
                    <Ionicons name="add" size={18} color={colors.primaryDark} />
                  </Pressable>
                </View>
              </View>
            </View>

            <Text style={styles.label}>Anotações</Text>
            <TextInput
              style={[styles.input, styles.inputNotas]}
              value={notas}
              onChangeText={setNotas}
              placeholder="Opcional"
              placeholderTextColor={colors.textLight}
              multiline
            />

            {tarefa && (
              <Pressable onPress={excluir} style={[styles.botaoExcluir, confirmarExclusao && styles.botaoExcluirConfirmar]}>
                <Ionicons name="trash-outline" size={16} color={confirmarExclusao ? colors.white : '#DC2626'} />
                <Text style={[styles.textoExcluir, confirmarExclusao && { color: colors.white }]}>
                  {confirmarExclusao ? 'Toque de novo para excluir' : 'Excluir tarefa'}
                </Text>
              </Pressable>
            )}
          </ScrollView>

          <View style={styles.acoes}>
            <Pressable onPress={onFechar} style={styles.botaoCancelar}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </Pressable>
            <Pressable onPress={salvar} style={styles.botaoSalvar}>
              <Text style={styles.textoSalvar}>Salvar</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  caixa: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '92%',
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  botaoFechar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conteudo: {
    padding: 16,
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.white,
  },
  inputNotas: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  erro: {
    color: '#DC2626',
    fontSize: 12,
  },
  linhaBotoes: {
    flexDirection: 'row',
    gap: 8,
  },
  opcao: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  opcaoAtiva: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  opcaoTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  opcaoTextoAtivo: {
    color: colors.white,
  },
  contador: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 4,
  },
  botaoContador: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valorContador: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  botaoExcluir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
  },
  botaoExcluirConfirmar: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  textoExcluir: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  acoes: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  botaoCancelar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  textoCancelar: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
  },
  botaoSalvar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  textoSalvar: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
