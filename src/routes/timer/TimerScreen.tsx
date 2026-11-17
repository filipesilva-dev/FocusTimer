import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, useWindowDimensions,
  Modal, TextInput, ScrollView, KeyboardAvoidingView, Platform,
  AppState, AppStateStatus,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import ModalFimSessao from '../../components/ModalFimSessao';
import { colors } from '../../theme/colors';
import { buscarFraseMotivacional } from '../../services/frasesMotivacionais';
import { tocarAlarme } from '../../services/alarme';
import { configurarNotificacoes, agendarFimDeFoco, cancelarNotificacao } from '../../services/notificacoes';
import { loadTasks, saveTasks } from '../../storage/tasks';
import { Task } from '../../types';
import { lerTimerConfig, salvarTimerConfig, CONFIG_PADRAO, Config } from '../../storage/timerConfig';
import { segundosParaHMS, hmsParaSegundos, formatarTimer, formatarTempoCurto } from '../../utils/tempo';

type Modo = 'foco' | 'pausaCurta' | 'pausaLonga';

function segundosDoModo(m: Modo, c: Config): number {
  if (m === 'foco') return c.focoSeg;
  if (m === 'pausaCurta') return c.pausaCurtaSeg;
  return c.pausaLongaSeg;
}

export default function TimerScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [config, setConfig] = useState<Config>(CONFIG_PADRAO);
  const [modo, setModo] = useState<Modo>('foco');
  const [sessaoAtual, setSessaoAtual] = useState(1);
  const [timeLeft, setTimeLeft] = useState(CONFIG_PADRAO.focoSeg);
  const [isRunning, setIsRunning] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [draftConfig, setDraftConfig] = useState<Config>(CONFIG_PADRAO);
  const [modalFimVisible, setModalFimVisible] = useState(false);
  const [fraseMotivacional, setFraseMotivacional] = useState('');
  const [carregandoFrase, setCarregandoFrase] = useState(false);
  const [sessoesHoje, setSessoesHoje] = useState(0);
  const [tarefasDisponiveis, setTarefasDisponiveis] = useState<Task[]>([]);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Task | null>(null);
  const [modalTarefasVisible, setModalTarefasVisible] = useState(false);
  const notificacaoId = useRef<string | null>(null);

  const totalTime = segundosDoModo(modo, config);


  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      const carregarTarefas = async () => {
        const lista = await loadTasks();
        if (ativo) {
          // Pega todas as tarefas que não estão concluídas, independente da data
          setTarefasDisponiveis(lista.filter(t => !t.status));
        }
      };
      carregarTarefas();
      return () => { ativo = false; };
    }, [])
  );

  useEffect(() => {
    configurarNotificacoes();
    const loadSessoes = async () => {
      const hoje = new Date().toISOString().slice(0, 10);
      const stored = await AsyncStorage.getItem('@FocusTimer/focoHoje');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === hoje) setSessoesHoje(parsed.count);
        else await AsyncStorage.setItem('@FocusTimer/focoHoje', JSON.stringify({ date: hoje, count: 0 }));
      }
    };
    loadSessoes();
    
    const loadConfig = async () => {
      const salva = await lerTimerConfig();
      setConfig(salva);
      setTimeLeft(salva.focoSeg);
    };
    loadConfig();
  }, []);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'background' && isRunning) {
        setIsRunning(false);
        cancelarNotificacao(notificacaoId.current);
        notificacaoId.current = null;
      }
    });
    return () => sub.remove();
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      tocarAlarme();
      
      if (modo === 'foco') {
        const incrementarSessao = async () => {
          const hoje = new Date().toISOString().slice(0, 10);
          const stored = await AsyncStorage.getItem('@FocusTimer/focoHoje');
          let count = 1;
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.date === hoje) count = parsed.count + 1;
          }
          setSessoesHoje(count);
          await AsyncStorage.setItem('@FocusTimer/focoHoje', JSON.stringify({ date: hoje, count }));

          // Atualiza a Tarefa se houver uma selecionada
          if (tarefaSelecionada) {
            const todas = await loadTasks();
            const atualizadas = todas.map(t => {
              if (t.id === tarefaSelecionada.id) {
                return {
                  ...t,
                  completedPomodoros: t.completedPomodoros + 1,
                  tempoEstudadoMinutos: (t.tempoEstudadoMinutos || 0) + Math.floor(config.focoSeg / 60),
                };
              }
              return t;
            });
            await saveTasks(atualizadas);
            // Atualiza o estado local para refletir na UI
            const novaTarefa = atualizadas.find(t => t.id === tarefaSelecionada.id);
            if (novaTarefa) setTarefaSelecionada(novaTarefa);
          }
        };
        incrementarSessao();
      }
      
      abrirModalFim();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isRunning]);

  useEffect(() => {
    if (!isRunning) setTimeLeft(segundosDoModo(modo, config));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  async function abrirModalFim() {
    setModalFimVisible(true);
    setCarregandoFrase(true);
    setFraseMotivacional('');
    const frase = await buscarFraseMotivacional();
    setFraseMotivacional(frase);
    setCarregandoFrase(false);
  }

  function aplicarModo(novoModo: Modo, novaSessao: number) {
    setModo(novoModo);
    setSessaoAtual(novaSessao);
    setTimeLeft(segundosDoModo(novoModo, config));
  }

  function avancarCiclo() {
    if (modo === 'foco') {
      if (sessaoAtual >= config.ciclos) aplicarModo('pausaLonga', 1);
      else aplicarModo('pausaCurta', sessaoAtual + 1);
    } else {
      aplicarModo('foco', sessaoAtual);
    }
  }

  function proximoModoInfo() {
    if (modo === 'foco') {
      if (sessaoAtual >= config.ciclos) return { label: `Pausa Longa · ${formatarTempoCurto(config.pausaLongaSeg)}` };
      return { label: `Pausa Curta · ${formatarTempoCurto(config.pausaCurtaSeg)}` };
    }
    return { label: `Foco · ${formatarTempoCurto(config.focoSeg)}` };
  }

  async function handleContinuar() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalFimVisible(false);
    const eraPausa = modo !== 'foco';
    avancarCiclo();
    if (eraPausa) notificacaoId.current = await agendarFimDeFoco(config.focoSeg);
    setIsRunning(true);
  }

  async function handleParar() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await cancelarNotificacao(notificacaoId.current);
    notificacaoId.current = null;
    setModalFimVisible(false);
    setIsRunning(false);
    setTimeLeft(segundosDoModo(modo, config));
  }

  async function toggleTimer() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!isRunning) {
      if (modo === 'foco') notificacaoId.current = await agendarFimDeFoco(config.focoSeg);
    } else {
      await cancelarNotificacao(notificacaoId.current);
      notificacaoId.current = null;
    }
    setIsRunning((p) => !p);
  }

  async function resetTimer() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await cancelarNotificacao(notificacaoId.current);
    notificacaoId.current = null;
    setIsRunning(false);
    setTimeLeft(segundosDoModo(modo, config));
  }

  function trocarModo(novo: Modo) {
    if (isRunning || novo === modo) return;
    Haptics.selectionAsync();
    if (novo === 'foco') aplicarModo('foco', 1);
    else aplicarModo(novo, sessaoAtual);
  }

  function abrirConfig() {
    Haptics.selectionAsync();
    setDraftConfig(config);
    setConfigModalVisible(true);
  }

  function fecharConfig() { setConfigModalVisible(false); }

  async function salvarConfig() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const validado: Config = {
      focoSeg: Math.max(1, draftConfig.focoSeg),
      pausaCurtaSeg: Math.max(1, draftConfig.pausaCurtaSeg),
      pausaLongaSeg: Math.max(1, draftConfig.pausaLongaSeg),
      ciclos: Math.max(1, draftConfig.ciclos),
    };
    setConfig(validado);
    setConfigModalVisible(false);
    await salvarTimerConfig(validado);
  }

  function handleResetFromConfig() {
    resetTimer();
    fecharConfig();
  }

  const formattedTime = formatarTimer(timeLeft);
  const size = Math.min(width * 0.65, height * 0.32, 240);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progresso = totalTime > 0 ? 1 - timeLeft / totalTime : 0;
  const strokeDashoffset = circumference * (1 - progresso);
  const fontSize = Math.min(size * 0.25, 56);
  const ehFoco = modo === 'foco';
  const corProgresso = ehFoco ? colors.primary : colors.pause;
  const corFundoCirculo = ehFoco ? colors.primaryTint : colors.pauseBg;
  const modoLabel = ehFoco ? '🎯 MODO FOCO' : modo === 'pausaCurta' ? '☕ PAUSA CURTA' : '🛋️ PAUSA LONGA';

  const proximoInfo = proximoModoInfo();
  const modalTitulo = ehFoco ? 'Sessão de foco concluída!' : 'Pausa concluída!';
  const modalEmoji = ehFoco ? '🎯' : '☕';

  return (
    <View style={styles.container}>
      <Header subtitle="Foco & Produtividade" />
      
      <View style={styles.mainContent}>
        <View style={styles.modoContainer}>
          <Pressable onPress={() => trocarModo('foco')} style={[styles.modoBtn, styles.modoBtnFull, ehFoco && styles.modoBtnAtivoFoco]}>
            <Text style={[styles.modoBtnText, ehFoco && styles.modoBtnTextAtivo]}>Foco</Text>
          </Pressable>
          <View style={styles.modoRowBottom}>
            <Pressable onPress={() => trocarModo('pausaCurta')} style={[styles.modoBtn, styles.modoBtnHalf, modo === 'pausaCurta' && styles.modoBtnAtivoPausa]}>
              <Text style={[styles.modoBtnText, modo === 'pausaCurta' && styles.modoBtnTextAtivo]}>Pausa Curta</Text>
            </Pressable>
            <Pressable onPress={() => trocarModo('pausaLonga')} style={[styles.modoBtn, styles.modoBtnHalf, modo === 'pausaLonga' && styles.modoBtnAtivoPausa]}>
              <Text style={[styles.modoBtnText, modo === 'pausaLonga' && styles.modoBtnTextAtivo]}>Pausa Longa</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.modeBadge}>
          <Text style={[styles.modeText, { color: corProgresso }]}>{modoLabel}</Text>
        </View>

        <View style={{ width: size, height: size }}>
          <Svg width={size} height={size}>
            <Circle cx={size/2} cy={size/2} r={radius} stroke={corFundoCirculo} strokeWidth={strokeWidth} fill="transparent" />
            <Circle cx={size/2} cy={size/2} r={radius} stroke={corProgresso} strokeWidth={strokeWidth} fill="transparent" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={strokeDashoffset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
          </Svg>
          <View style={[StyleSheet.absoluteFill, styles.timerCenter]}>
            <Text style={[styles.timerText, { fontSize }]}>{formattedTime}</Text>
            {ehFoco && <Text style={styles.sessaoText}>Sessão {sessaoAtual} de {config.ciclos}</Text>}
          </View>
        </View>

        <Pressable style={[styles.button, isRunning ? styles.buttonPause : styles.buttonStart]} onPress={toggleTimer}>
          <Text style={styles.buttonText}>{isRunning ? 'PAUSAR' : 'INICIAR'}</Text>
        </Pressable>

        {/* Seletor de Tarefa */}
        <Pressable style={styles.tarefaSelector} onPress={() => setModalTarefasVisible(true)}>
          <Ionicons name={tarefaSelecionada ? "book" : "book-outline"} size={18} color={tarefaSelecionada ? colors.primary : colors.textMuted} />
          <Text style={[styles.tarefaSelectorText, tarefaSelecionada && { color: colors.primary, fontWeight: '700' }]} numberOfLines={1}>
            {tarefaSelecionada ? tarefaSelecionada.title : 'Vincular a uma tarefa (Opcional)'}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
        </Pressable>

        <Pressable style={styles.buttonConfigMain} onPress={abrirConfig}>
          <Ionicons name="settings-outline" size={18} color={colors.textMuted} />
          <Text style={styles.buttonConfigText}>Configurar tempos</Text>
        </Pressable>

        <View style={styles.sessoesCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="flame" size={22} color={colors.pause} />
          </View>
          <View style={styles.sessoesTextos}>
            <Text style={styles.sessoesLabel}>FOCO HOJE</Text>
            <Text style={styles.sessoesValor}>{sessoesHoje} {sessoesHoje === 1 ? 'sessão' : 'sessões'}</Text>
          </View>
        </View>
      </View>

      {/* BOTTOM SHEET DE SELECIONAR TAREFA */}
      <Modal visible={modalTarefasVisible} transparent animationType="slide" onRequestClose={() => setModalTarefasVisible(false)}>
        <View style={styles.bottomSheetBackdrop}>
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHandle} />
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Selecionar Tarefa</Text>
              <Pressable onPress={() => setModalTarefasVisible(false)} hitSlop={12}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}>
              <Pressable style={[styles.taskOption, !tarefaSelecionada && styles.taskOptionSelected]} onPress={() => { setTarefaSelecionada(null); setModalTarefasVisible(false); }}>
                <Text style={[styles.taskTitle, !tarefaSelecionada && { color: colors.primary }]}>Nenhuma tarefa (Apenas contar tempo)</Text>
              </Pressable>
              {tarefasDisponiveis.length === 0 && (
                <Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 20 }}>Nenhuma tarefa pendente encontrada.</Text>
              )}
              {tarefasDisponiveis.map(t => {
                const [ano, mes, dia] = t.date.split('-');
                const hoje = new Date();
                const dataLocal = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
                const isHoje = t.date === dataLocal;
                const dataFormatada = isHoje ? 'Hoje' : `${dia}/${mes}`;

                return (
                  <Pressable key={t.id} style={[styles.taskOption, tarefaSelecionada?.id === t.id && styles.taskOptionSelected]} onPress={() => { setTarefaSelecionada(t); setModalTarefasVisible(false); }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.taskTitle, tarefaSelecionada?.id === t.id && { color: colors.primary }]} numberOfLines={1}>{t.title}</Text>
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                        <Text style={styles.taskSubtitle}>{t.className}</Text>
                        <Text style={styles.taskSubtitle}>•</Text>
                        <Text style={[styles.taskSubtitle, isHoje && { color: colors.primary, fontWeight: '700' }]}>{dataFormatada}</Text>
                      </View>
                    </View>
                    <Text style={styles.taskPomodoros}>{t.completedPomodoros}/{t.pomodoroAmount} 🍅</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL DE CONFIGURAÇÃO SEM SCROLL */}
      <Modal visible={configModalVisible} transparent animationType="fade" onRequestClose={fecharConfig}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Configurar Timer</Text>
                <Pressable onPress={fecharConfig} hitSlop={12} style={styles.modalCloseBtn}>
                  <Ionicons name="close" size={22} color={colors.text} />
                </Pressable>
              </View>

              <View style={styles.modalContent}>
                <ConfigTempo label="Foco" segundos={draftConfig.focoSeg} onChange={(v) => setDraftConfig({ ...draftConfig, focoSeg: v })} />
                <ConfigTempo label="Pausa curta" segundos={draftConfig.pausaCurtaSeg} onChange={(v) => setDraftConfig({ ...draftConfig, pausaCurtaSeg: v })} />
                <ConfigTempo label="Pausa longa" segundos={draftConfig.pausaLongaSeg} onChange={(v) => setDraftConfig({ ...draftConfig, pausaLongaSeg: v })} />

                <View style={styles.ciclosBlock}>
                  <View style={styles.configHeader}>
                    <Text style={styles.configTempoLabel}>Ciclos por rodada</Text>
                  </View>
                  <View style={styles.ciclosRow}>
                    <TextInput style={styles.ciclosInput} keyboardType="number-pad" value={String(draftConfig.ciclos)} onChangeText={(t) => {
                      const clean = t.replace(/[^0-9]/g, '');
                      setDraftConfig({ ...draftConfig, ciclos: parseInt(clean, 10) || 0 });
                    }} selectTextOnFocus />
                    <Text style={styles.ciclosHint}>ciclos até a pausa longa</Text>
                  </View>
                </View>

                <Pressable style={styles.btnResetModal} onPress={handleResetFromConfig}>
                  <Ionicons name="refresh" size={18} color={colors.pauseDark} />
                  <Text style={styles.btnResetModalText}>Reiniciar Timer Atual</Text>
                </Pressable>
              </View>

              <View style={[styles.modalActions, { paddingBottom: Math.max(16, insets.bottom) }]}>
                <Pressable style={styles.btnCancel} onPress={fecharConfig}>
                  <Text style={styles.btnCancelText}>Cancelar</Text>
                </Pressable>
                <Pressable style={styles.btnSave} onPress={salvarConfig}>
                  <Text style={styles.btnSaveText}>Salvar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <ModalFimSessao
        visible={modalFimVisible}
        carregando={carregandoFrase}
        frase={fraseMotivacional}
        titulo={modalTitulo}
        emoji={modalEmoji}
        proximoLabel={proximoInfo.label}
        onContinuar={handleContinuar}
        onParar={handleParar}
      />
    </View>
  );
}

function ConfigTempo({ label, segundos, onChange }: { label: string; segundos: number; onChange: (seg: number) => void }) {
  const hms = segundosParaHMS(segundos);
  const [campos, setCampos] = useState({ h: String(hms.h), m: String(hms.m), s: String(hms.s) });
  const [atualizado, setAtualizado] = useState(false);

  useEffect(() => {
    if (!atualizado) return;
    const novo = segundosParaHMS(segundos);
    setCampos({ h: String(novo.h), m: String(novo.m), s: String(novo.s) });
    setAtualizado(false);
  }, [segundos, atualizado]);

  function alterar(campo: 'h' | 'm' | 's', texto: string) {
    const clean = texto.replace(/[^0-9]/g, '');
    const novos = { ...campos, [campo]: clean };
    setCampos(novos);
    const hN = parseInt(novos.h, 10) || 0;
    const mN = parseInt(novos.m, 10) || 0;
    const sN = parseInt(novos.s, 10) || 0;
    setAtualizado(true);
    onChange(Math.max(1, hmsParaSegundos(hN, mN, sN)));
  }

  return (
    <View style={styles.configTempoBloco}>
      <View style={styles.configHeader}>
        <Text style={styles.configTempoLabel}>{label}</Text>
        <Text style={styles.configTempoPreview}>Total: {formatarTempoCurto(segundos)}</Text>
      </View>
      <View style={styles.unitsRow}>
        <View style={styles.unitCol}>
          <TextInput style={styles.unitInput} keyboardType="number-pad" value={campos.h} onChangeText={(t) => alterar('h', t)} selectTextOnFocus maxLength={3} />
          <Text style={styles.unitLabel}>h</Text>
        </View>
        <Text style={styles.unitSeparator}>:</Text>
        <View style={styles.unitCol}>
          <TextInput style={styles.unitInput} keyboardType="number-pad" value={campos.m} onChangeText={(t) => alterar('m', t)} selectTextOnFocus maxLength={3} />
          <Text style={styles.unitLabel}>m</Text>
        </View>
        <Text style={styles.unitSeparator}>:</Text>
        <View style={styles.unitCol}>
          <TextInput style={styles.unitInput} keyboardType="number-pad" value={campos.s} onChangeText={(t) => alterar('s', t)} selectTextOnFocus maxLength={2} />
          <Text style={styles.unitLabel}>s</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primaryBg },
  mainContent: { flex: 1, alignItems: 'center', justifyContent: 'space-evenly', paddingHorizontal: 16, paddingBottom: 16 },
  
  modoContainer: { width: '100%', gap: 8 },
  modoRowBottom: { flexDirection: 'row', gap: 8 },
  modoBtn: { height: 40, borderRadius: 12, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  modoBtnFull: { width: '100%' },
  modoBtnHalf: { flex: 1 },
  modoBtnAtivoFoco: { backgroundColor: colors.primary, borderColor: colors.primary },
  modoBtnAtivoPausa: { backgroundColor: colors.pause, borderColor: colors.pause },
  modoBtnText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  modoBtnTextAtivo: { color: colors.white },
  
  modeBadge: { backgroundColor: colors.white, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  modeText: { fontSize: 12, fontWeight: '700' },
  
  timerCenter: { justifyContent: 'center', alignItems: 'center' },
  timerText: { fontWeight: 'bold', color: colors.text },
  sessaoText: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  
  button: { width: '80%', maxWidth: 240, paddingVertical: 14, borderRadius: 30, alignItems: 'center' },
  buttonStart: { backgroundColor: colors.primary },
  buttonPause: { backgroundColor: colors.pause },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  
  tarefaSelector: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.border, width: '80%', maxWidth: 240 },
  tarefaSelectorText: { flex: 1, color: colors.textMuted, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  
  bottomSheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%', minHeight: '40%' },
  bottomSheetHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: colors.grayStroke, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  bottomSheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  bottomSheetTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  
  taskOption: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.primaryBg },
  taskOptionSelected: { borderColor: colors.primary, backgroundColor: colors.white },
  taskTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  taskSubtitle: { fontSize: 13, color: colors.textMuted },
  taskPomodoros: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  buttonConfigMain: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  buttonConfigText: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  
  sessoesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    width: '80%',
    maxWidth: 240,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.pauseBg, alignItems: 'center', justifyContent: 'center' },
  sessoesTextos: { flex: 1 },
  sessoesLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  sessoesValor: { fontSize: 16, fontWeight: '800', color: colors.text },

  // Modal Styles (Sem Scroll)
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalBox: { width: '100%', maxWidth: 440, backgroundColor: colors.white, borderRadius: 20, overflow: 'hidden', flexDirection: 'column' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  modalCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primaryBg, alignItems: 'center', justifyContent: 'center' },
  modalContent: { padding: 16 },
  
  configTempoBloco: { backgroundColor: colors.primaryBg, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  configHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  configTempoLabel: { fontSize: 13, fontWeight: '700', color: colors.text },
  configTempoPreview: { fontSize: 12, fontWeight: '700', color: colors.primary },
  
  unitsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  unitCol: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 4, height: 48, overflow: 'hidden' },
  unitInput: { flex: 1, fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: colors.text, height: '100%', padding: 0, margin: 0 },
  unitLabel: { fontSize: 14, color: colors.textMuted, fontWeight: '600', marginLeft: 4 },
  unitSeparator: { fontSize: 20, fontWeight: 'bold', color: colors.textMuted },

  ciclosBlock: { backgroundColor: colors.primaryBg, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  ciclosRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ciclosInput: { width: 70, minHeight: 48, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: colors.text },
  ciclosHint: { flex: 1, fontSize: 12, color: colors.textMuted },

  btnResetModal: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#FDE68A', backgroundColor: '#FEF3C7' },
  btnResetModalText: { fontSize: 14, fontWeight: '700', color: colors.pauseDark },

  modalActions: { flexDirection: 'row', gap: 12, padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
  btnCancel: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', backgroundColor: colors.white },
  btnCancelText: { fontSize: 14, fontWeight: '700', color: colors.textMuted },
  btnSave: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center' },
  btnSaveText: { fontSize: 14, fontWeight: '700', color: colors.white },
});
