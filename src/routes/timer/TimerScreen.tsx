import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, useWindowDimensions,
  Modal, TextInput, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import ModalFimSessao from '../../components/ModalFimSessao';
import { colors } from '../../theme/colors';
import { buscarFraseMotivacional } from '../../services/frasesMotivacionais';
import { tocarAlarme } from '../../services/alarme';
import {
  segundosParaHMS, hmsParaSegundos, formatarTimer, formatarTempoCurto,
} from '../../utils/tempo';

type Modo = 'foco' | 'pausaCurta' | 'pausaLonga';
type Config = { focoSeg: number; pausaCurtaSeg: number; pausaLongaSeg: number; ciclos: number };

const CONFIG_PADRAO: Config = {
  focoSeg: 25 * 60,
  pausaCurtaSeg: 5 * 60,
  pausaLongaSeg: 15 * 60,
  ciclos: 4,
};

function segundosDoModo(m: Modo, c: Config): number {
  if (m === 'foco') return c.focoSeg;
  if (m === 'pausaCurta') return c.pausaCurtaSeg;
  return c.pausaLongaSeg;
}

export default function TimerScreen() {
  const { width } = useWindowDimensions();
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

  const totalTime = segundosDoModo(modo, config);

  // Tick do cronômetro
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, timeLeft]);

  // Fim do ciclo → alarme + modal
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      tocarAlarme();
      abrirModalFim();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isRunning]);

  // Se config mudou com timer parado, reseta display
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

  // CONTINUAR: avança o ciclo E inicia automaticamente o próximo timer
  function handleContinuar() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalFimVisible(false);
    avancarCiclo();
    setIsRunning(true);   // ← auto-start
  }

  // PARAR: reseta o modo atual E espera o usuário apertar INICIAR
  function handleParar() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalFimVisible(false);
    setIsRunning(false);  // ← espera o usuário
    setTimeLeft(segundosDoModo(modo, config));
  }

  function toggleTimer() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRunning((p) => !p);
  }

  function resetTimer() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

  function salvarConfig() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const validado: Config = {
      focoSeg: Math.max(1, draftConfig.focoSeg),
      pausaCurtaSeg: Math.max(1, draftConfig.pausaCurtaSeg),
      pausaLongaSeg: Math.max(1, draftConfig.pausaLongaSeg),
      ciclos: Math.max(1, draftConfig.ciclos),
    };
    setConfig(validado);
    setConfigModalVisible(false);
  }

  const formattedTime = formatarTimer(timeLeft);
  const size = Math.min(width * 0.7, 240);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progresso = totalTime > 0 ? 1 - timeLeft / totalTime : 0;
  const strokeDashoffset = circumference * (1 - progresso);
  const fontSize = Math.min(width * 0.15, 56);
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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

        <View style={{ width: size, height: size, marginBottom: 24 }}>
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

        <Pressable style={styles.buttonReset} onPress={resetTimer}>
          <Text style={styles.buttonResetText}>Reiniciar</Text>
        </Pressable>

        <Pressable style={styles.buttonConfig} onPress={abrirConfig}>
          <Text style={styles.buttonConfigText}>⚙️ Configurar tempos</Text>
        </Pressable>
      </ScrollView>

      {/* ═══ GAVETA DE CONFIGURAÇÃO (fix) ═══ */}
      <Modal visible={configModalVisible} transparent animationType="fade" onRequestClose={fecharConfig}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Configurar Timer</Text>
                <Pressable onPress={fecharConfig} hitSlop={12} style={styles.modalCloseBtn}>
                  <Ionicons name="close" size={22} color={colors.text} />
                </Pressable>
              </View>

              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.modalScrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <ConfigTempo label="Foco" segundos={draftConfig.focoSeg} onChange={(v) => setDraftConfig({ ...draftConfig, focoSeg: v })} />
                <ConfigTempo label="Pausa curta" segundos={draftConfig.pausaCurtaSeg} onChange={(v) => setDraftConfig({ ...draftConfig, pausaCurtaSeg: v })} />
                <ConfigTempo label="Pausa longa" segundos={draftConfig.pausaLongaSeg} onChange={(v) => setDraftConfig({ ...draftConfig, pausaLongaSeg: v })} />

                <View style={styles.ciclosBlock}>
                  <Text style={styles.configTempoLabel}>Ciclos por rodada</Text>
                  <View style={styles.ciclosRow}>
                    <TextInput
                      style={styles.ciclosInput}
                      keyboardType="number-pad"
                      value={String(draftConfig.ciclos)}
                      onChangeText={(t) => {
                        const clean = t.replace(/[^0-9]/g, '');
                        setDraftConfig({ ...draftConfig, ciclos: parseInt(clean, 10) || 0 });
                      }}
                      selectTextOnFocus
                    />
                    <Text style={styles.ciclosHint}>ciclos até a pausa longa</Text>
                  </View>
                </View>
              </ScrollView>

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
      <Text style={styles.configTempoLabel}>{label}</Text>
      <View style={styles.unitsRow}>
        <View style={styles.unitCol}>
          <TextInput style={styles.unitInput} keyboardType="number-pad" value={campos.h} onChangeText={(t) => alterar('h', t)} selectTextOnFocus maxLength={3} />
          <Text style={styles.unitLabel}>horas</Text>
        </View>
        <View style={styles.unitCol}>
          <TextInput style={styles.unitInput} keyboardType="number-pad" value={campos.m} onChangeText={(t) => alterar('m', t)} selectTextOnFocus maxLength={3} />
          <Text style={styles.unitLabel}>min</Text>
        </View>
        <View style={styles.unitCol}>
          <TextInput style={styles.unitInput} keyboardType="number-pad" value={campos.s} onChangeText={(t) => alterar('s', t)} selectTextOnFocus maxLength={2} />
          <Text style={styles.unitLabel}>seg</Text>
        </View>
      </View>
      <Text style={styles.configTempoPreview}>Total: {formatarTempoCurto(segundos)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primaryBg },
  scrollContent: { alignItems: 'center', paddingTop: 16, paddingHorizontal: 16, paddingBottom: 32 },
  modoContainer: { width: '100%', gap: 8, marginBottom: 16 },
  modoRowBottom: { flexDirection: 'row', gap: 8 },
  modoBtn: { height: 44, borderRadius: 12, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  modoBtnFull: { width: '100%' },
  modoBtnHalf: { flex: 1 },
  modoBtnAtivoFoco: { backgroundColor: colors.primary, borderColor: colors.primary },
  modoBtnAtivoPausa: { backgroundColor: colors.pause, borderColor: colors.pause },
  modoBtnText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  modoBtnTextAtivo: { color: colors.white },
  modeBadge: { backgroundColor: colors.white, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: colors.border },
  modeText: { fontSize: 13, fontWeight: '700' },
  timerCenter: { justifyContent: 'center', alignItems: 'center' },
  timerText: { fontWeight: 'bold', color: colors.text },
  sessaoText: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  button: { width: '80%', maxWidth: 240, paddingVertical: 16, borderRadius: 30, alignItems: 'center', marginTop: 8, marginBottom: 12 },
  buttonStart: { backgroundColor: colors.primary },
  buttonPause: { backgroundColor: colors.pause },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  buttonReset: { padding: 8 },
  buttonResetText: { color: colors.primaryDarker, fontSize: 14, textDecorationLine: 'underline' },
  buttonConfig: { marginTop: 16, padding: 12 },
  buttonConfigText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalBox: { width: '100%', maxWidth: 440, maxHeight: '92%', backgroundColor: colors.white, borderRadius: 20, overflow: 'hidden', flexDirection: 'column' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  modalCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primaryBg, alignItems: 'center', justifyContent: 'center' },
  modalScrollContent: { padding: 16, gap: 12 },
  modalActions: { flexDirection: 'row', gap: 12, padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
  btnCancel: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', backgroundColor: colors.white },
  btnCancelText: { fontSize: 14, fontWeight: '700', color: colors.textMuted },
  btnSave: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center' },
  btnSaveText: { fontSize: 14, fontWeight: '700', color: colors.white },
  configTempoBloco: { backgroundColor: colors.primaryBg, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border },
  configTempoLabel: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 12 },
  unitsRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  unitCol: { flex: 1, alignItems: 'center' },
  unitInput: { width: '100%', minHeight: 54, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 4, fontSize: 22, fontWeight: '700', textAlign: 'center', color: colors.text },
  unitLabel: { fontSize: 11, fontWeight: '600', color: colors.textMuted, marginTop: 6, textAlign: 'center' },
  configTempoPreview: { fontSize: 12, fontWeight: '600', color: colors.primary, textAlign: 'center', marginTop: 4 },
  ciclosBlock: { backgroundColor: colors.primaryBg, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border },
  ciclosRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ciclosInput: { width: 90, minHeight: 54, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, paddingVertical: 12, fontSize: 22, fontWeight: '700', textAlign: 'center', color: colors.text },
  ciclosHint: { flex: 1, fontSize: 12, color: colors.textMuted },
});
