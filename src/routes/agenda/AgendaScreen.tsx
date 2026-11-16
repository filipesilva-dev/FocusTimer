import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../components/Header';
import { colors } from '../../theme/colors';
import { formatarTempoCurto } from '../../utils/tempo';
import { Task } from '../../types';
import { loadTasks, saveTasks } from '../../storage/tasks';

import TarefaModal from './TarefaModal';

const MIN_POMODORO = 25; // igual ao timer

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const NOMES_DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

// quanto mais pomodoro no dia, mais escuro fica o verde
const CORES = [colors.white, colors.primaryTint, colors.primaryLight, colors.primary, colors.primaryDarker];

const prioridades: Record<number, string> = { 1: 'Baixa', 2: 'Média', 3: 'Alta', 4: 'Finalizada' };
const coresPrioridade: Record<number, string> = {
  1: colors.primaryLight,
  2: colors.pause,
  3: '#EF4444',
  4: colors.textLight,
};

// deixa no mesmo formato que a data é salva na tarefa (AAAA-MM-DD)
function formatarData(ano: number, mes: number, dia: number) {
  const m = String(mes + 1).padStart(2, '0');
  const d = String(dia).padStart(2, '0');
  return `${ano}-${m}-${d}`;
}

function getNivel(pomodoros: number) {
  if (pomodoros === 0) return 0;
  if (pomodoros === 1) return 1;
  if (pomodoros <= 3) return 2;
  if (pomodoros <= 5) return 3;
  return 4;
}

function formatarMinutos(min: number) {
  if (min === 0) return '0min';
  return formatarTempoCurto(min * 60);
}

export default function AgendaScreen() {
  const hoje = new Date();
  const dataHoje = formatarData(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [diaSelecionado, setDiaSelecionado] = useState(dataHoje);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [erro, setErro] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState<Task | null>(null);

  // carrega de novo toda vez que abre a aba, pra pegar o que mudou nas outras telas
  useFocusEffect(
    useCallback(() => {
      loadTasks()
        .then((lista) => setTasks(lista))
        .catch((e) => {
          console.error(e);
          setErro('Não foi possível carregar as tarefas.');
        });
    }, [])
  );

  function tarefasDoDia(data: string) {
    return tasks.filter((t) => t.date === data);
  }

  function pomodorosDoDia(data: string) {
    let total = 0;
    tarefasDoDia(data).forEach((t) => {
      total += t.completedPomodoros;
    });
    return total;
  }

  function trocarMes(novoMes: number, novoAno: number) {
    setMes(novoMes);
    setAno(novoAno);
    setDiaSelecionado(formatarData(novoAno, novoMes, 1));
  }

  function mesAnterior() {
    if (mes === 0) trocarMes(11, ano - 1);
    else trocarMes(mes - 1, ano);
  }

  function proximoMes() {
    if (mes === 11) trocarMes(0, ano + 1);
    else trocarMes(mes + 1, ano);
  }

  function irParaHoje() {
    setMes(hoje.getMonth());
    setAno(hoje.getFullYear());
    setDiaSelecionado(dataHoje);
  }

  // atualiza a tela na hora e salva no AsyncStorage
  async function salvarLista(novaLista: Task[]) {
    setTasks(novaLista);
    try {
      await saveTasks(novaLista);
    } catch (e) {
      console.error(e);
      setErro('Não foi possível salvar as alterações.');
    }
  }

  function concluirTarefa(task: Task) {
    salvarLista(tasks.map((t) => (t.id === task.id ? { ...t, status: !t.status } : t)));
  }

  function novaTarefa() {
    setTarefaEditando(null);
    setModalVisivel(true);
  }

  function editarTarefa(task: Task) {
    setTarefaEditando(task);
    setModalVisivel(true);
  }

  function salvarTarefa(task: Task) {
    const jaExiste = tasks.some((t) => t.id === task.id);
    if (jaExiste) {
      salvarLista(tasks.map((t) => (t.id === task.id ? task : t)));
    } else {
      salvarLista([...tasks, task]);
    }
    setModalVisivel(false);
  }

  function excluirTarefa(id: string) {
    salvarLista(tasks.filter((t) => t.id !== id));
    setModalVisivel(false);
  }

  // monta o calendário: null = quadrado vazio
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const dias: (number | null)[] = [];
  for (let i = 0; i < primeiroDia; i++) dias.push(null);
  for (let d = 1; d <= totalDias; d++) dias.push(d);
  while (dias.length % 7 !== 0) dias.push(null);

  const semanas: (number | null)[][] = [];
  for (let i = 0; i < dias.length; i += 7) {
    semanas.push(dias.slice(i, i + 7));
  }

  // resumo do mês
  const prefixoMes = formatarData(ano, mes, 1).slice(0, 7); // ex: "2026-11"
  const tarefasDoMes = tasks.filter((t) => t.date.startsWith(prefixoMes));
  let minutosMes = 0;
  const diasEstudados: string[] = [];
  tarefasDoMes.forEach((t) => {
    minutosMes += t.completedPomodoros * MIN_POMODORO;
    if (t.completedPomodoros > 0 && !diasEstudados.includes(t.date)) {
      diasEstudados.push(t.date);
    }
  });
  const concluidas = tarefasDoMes.filter((t) => t.status).length;

  // dia selecionado (pendentes primeiro)
  const listaDia = tarefasDoDia(diaSelecionado).sort((a, b) => Number(a.status) - Number(b.status));
  const minutosDia = pomodorosDoDia(diaSelecionado) * MIN_POMODORO;
  const [a, m, d] = diaSelecionado.split('-').map(Number);
  const nomeDia = diaSelecionado === dataHoje ? 'Hoje' : NOMES_DIAS[new Date(a, m - 1, d).getDay()];
  const tituloDia = `${nomeDia}, ${d} de ${MESES[m - 1].toLowerCase()}`;

  const mostrarBotaoHoje = diaSelecionado !== dataHoje;

  return (
    <View style={styles.container}>
      <Header subtitle="Agenda de estudos" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.mesHeader}>
          <Pressable onPress={mesAnterior} style={styles.seta} hitSlop={8} accessibilityLabel="Mês anterior">
            <Ionicons name="chevron-back" size={20} color={colors.primaryDark} />
          </Pressable>

          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.mesTitulo}>{MESES[mes]} {ano}</Text>
            {mostrarBotaoHoje && (
              <Pressable onPress={irParaHoje} hitSlop={6}>
                <Text style={styles.linkHoje}>Voltar para hoje</Text>
              </Pressable>
            )}
          </View>

          <Pressable onPress={proximoMes} style={styles.seta} hitSlop={8} accessibilityLabel="Próximo mês">
            <Ionicons name="chevron-forward" size={20} color={colors.primaryDark} />
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.linha}>
            {DIAS_SEMANA.map((letra, i) => (
              <Text key={i} style={styles.diaSemana}>{letra}</Text>
            ))}
          </View>

          {semanas.map((semana, i) => (
            <View key={i} style={styles.linha}>
              {semana.map((dia, j) => {
                if (dia === null) return <View key={j} style={styles.celula} />;

                const data = formatarData(ano, mes, dia);
                const nivel = getNivel(pomodorosDoDia(data));
                const temPendente = tarefasDoDia(data).some((t) => !t.status);
                const escuro = nivel >= 3;

                return (
                  <View key={j} style={styles.celula}>
                    <Pressable
                      onPress={() => setDiaSelecionado(data)}
                      style={[
                        styles.dia,
                        { backgroundColor: CORES[nivel] },
                        nivel === 0 && styles.diaSemEstudo,
                        data === dataHoje && styles.diaHoje,
                        data === diaSelecionado && styles.diaSelecionado,
                      ]}
                    >
                      <Text style={[styles.diaTexto, escuro && { color: colors.white }]}>{dia}</Text>
                      {temPendente && (
                        <View style={[styles.ponto, escuro && { backgroundColor: colors.white }]} />
                      )}
                    </Pressable>
                  </View>
                );
              })}
            </View>
          ))}

          <View style={styles.legenda}>
            <Text style={styles.legendaTexto}>Menos</Text>
            {CORES.map((cor, i) => (
              <View key={i} style={[styles.legendaQuadrado, { backgroundColor: cor }, i === 0 && styles.diaSemEstudo]} />
            ))}
            <Text style={styles.legendaTexto}>Mais</Text>
          </View>
        </View>

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

        <View style={styles.resumo}>
          <View style={styles.resumoItem}>
            <Ionicons name="time-outline" size={18} color={colors.primaryDark} />
            <Text style={styles.resumoValor}>{formatarMinutos(minutosMes)}</Text>
            <Text style={styles.resumoLabel}>estudado</Text>
          </View>
          <View style={styles.resumoItem}>
            <Ionicons name="flame-outline" size={18} color={colors.primaryDark} />
            <Text style={styles.resumoValor}>{diasEstudados.length}</Text>
            <Text style={styles.resumoLabel}>dias ativos</Text>
          </View>
          <View style={styles.resumoItem}>
            <Ionicons name="checkmark-done-outline" size={18} color={colors.primaryDark} />
            <Text style={styles.resumoValor}>{concluidas}/{tarefasDoMes.length}</Text>
            <Text style={styles.resumoLabel}>tarefas</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.diaHeader}>
            <Text style={styles.diaTitulo}>{tituloDia}</Text>
            {minutosDia > 0 && (
              <View style={styles.badge}>
                <Ionicons name="timer-outline" size={13} color={colors.primaryDarker} />
                <Text style={styles.badgeTexto}>{formatarMinutos(minutosDia)}</Text>
              </View>
            )}
          </View>

          {listaDia.length === 0 && (
            <View style={styles.vazio}>
              <Ionicons name="calendar-clear-outline" size={32} color={colors.primaryTint} />
              <Text style={styles.vazioTexto}>Nenhuma tarefa para este dia.</Text>
            </View>
          )}

          {listaDia.map((task) => (
            <View key={task.id} style={styles.tarefa}>
              <Pressable
                onPress={() => concluirTarefa(task)}
                hitSlop={8}
                accessibilityLabel={task.status ? `Desmarcar ${task.title}` : `Concluir ${task.title}`}
              >
                <Ionicons
                  name={task.status ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={task.status ? colors.primary : colors.textLight}
                />
              </Pressable>

              <Pressable style={{ flex: 1 }} onPress={() => editarTarefa(task)}>
                <Text style={task.status ? styles.tarefaConcluida : styles.tarefaTitulo} numberOfLines={1}>
                  {task.title}
                </Text>
                <Text style={styles.tarefaSub}>
                  {task.className} - {task.completedPomodoros}/{task.pomodoroAmount} pomodoros
                </Text>
              </Pressable>

              <View style={[styles.prioridade, { backgroundColor: coresPrioridade[task.priority] }]}>
                <Text style={styles.prioridadeTexto}>{prioridades[task.priority]}</Text>
              </View>

              <Pressable
                onPress={() => editarTarefa(task)}
                style={styles.botaoEditar}
                hitSlop={6}
                accessibilityLabel={`Editar ${task.title}`}
              >
                <Ionicons name="pencil" size={15} color={colors.primaryDark} />
              </Pressable>
            </View>
          ))}

          <Pressable onPress={novaTarefa} style={styles.botaoAdicionar}>
            <Ionicons name="add" size={18} color={colors.primaryDark} />
            <Text style={styles.textoAdicionar}>Adicionar tarefa</Text>
          </Pressable>
        </View>
      </ScrollView>

      <TarefaModal
        visible={modalVisivel}
        tarefa={tarefaEditando}
        data={diaSelecionado}
        onFechar={() => setModalVisivel(false)}
        onSalvar={salvarTarefa}
        onExcluir={excluirTarefa}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
    gap: 14,
  },

  // topo com o mês
  mesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seta: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mesTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  linkHoje: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
    marginTop: 2,
    textDecorationLine: 'underline',
  },

  // calendário
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  linha: {
    flexDirection: 'row',
  },
  diaSemana: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    paddingBottom: 6,
  },
  celula: {
    flex: 1,
    aspectRatio: 1,
    padding: 3,
  },
  dia: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diaSemEstudo: {
    borderWidth: 1,
    borderColor: colors.grayStroke,
  },
  diaHoje: {
    borderWidth: 2,
    borderColor: colors.primaryDark,
  },
  diaSelecionado: {
    borderWidth: 2.5,
    borderColor: colors.pause,
  },
  diaTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  ponto: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.pause,
    marginTop: 2,
  },
  legenda: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 10,
  },
  legendaTexto: {
    fontSize: 11,
    color: colors.textMuted,
    marginHorizontal: 2,
  },
  legendaQuadrado: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  erro: {
    color: '#DC2626',
    textAlign: 'center',
  },

  // resumo do mês
  resumo: {
    flexDirection: 'row',
    gap: 10,
  },
  resumoItem: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  resumoValor: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  resumoLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },

  // lista do dia
  diaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  diaTitulo: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDarker,
  },
  vazio: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  vazioTexto: {
    fontSize: 13,
    color: colors.textLight,
  },
  tarefa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tarefaTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  tarefaConcluida: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textLight,
    textDecorationLine: 'line-through',
  },
  tarefaSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  prioridade: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  prioridadeTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  botaoEditar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoAdicionar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primaryLight,
    backgroundColor: colors.primaryBg,
  },
  textoAdicionar: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});
