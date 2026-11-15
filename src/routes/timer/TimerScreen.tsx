import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, useWindowDimensions,
  Modal, TextInput, ScrollView,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import Header from '../../components/Header';
import { colors } from '../../theme/colors';
import {
  segundosParaHMS, hmsParaSegundos, formatarTimer, formatarTempoCurto,
} from '../../utils/tempo';

type Modo = 'foco' | 'pausaCurta' | 'pausaLonga';
type Config = { focoSeg: number; pausaCurtaSeg: number; pausaLongaSeg: number; ciclos: number };
const CONFIG_PADRAO: Config = { focoSeg: 25 * 60, pausaCurtaSeg: 5 * 60, pausaLongaSeg: 15 * 60, ciclos: 4 };

function segundosDoModo(m: Modo, c: Config): number {
  if (m === 'foco') return c.focoSeg;
  if (m === 'pausaCurta') return c.pausaCurtaSeg;
  return c.pausaLongaSeg;
}

export default function TimerScreen() {
  const { width } = useWindowDimensions();
  const [config, setConfig] = useState<Config>(CONFIG_PADRAO);
  const [modo, setModo] = useState<Modo>('foco');
  const [sessaoAtual, setSessaoAtual] = useState(1);
  const [timeLeft, setTimeLeft] = useState(CONFIG_PADRAO.focoSeg);
  const [isRunning, setIsRunning] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [draftConfig, setDraftConfig] = useState<Config>(CONFIG_PADRAO);
  const totalTime = segundosDoModo(modo, config);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      avancarCiclo();
    }
  }, [timeLeft, isRunning]);

  useEffect(() => {
    if (!isRunning) setTimeLeft(segundosDoModo(modo, config));
  }, [config]);

  function aplicarModo(novoModo: Modo, novaSessao: number) {
    setModo(novoModo);
    setSessaoAtual(novaSessao);
    setTimeLeft(segundosDoModo(novoModo, config));
  }

  function avancarCiclo() {
    if (modo === 'foco') {
      if (sessaoAtual >= config.ciclos) aplicarModo('pausaLonga', 1);
      else aplicarModo('pausaCurta', sessaoAtual + 1);
    } else aplicarModo('foco', sessaoAtual);
  }

  function toggleTimer() { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setIsRunning((p) => !p); }
  function resetTimer() { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setIsRunning(false); setTimeLeft(segundosDoModo(modo, config)); }
  function trocarModo(novo: Modo) {
    if (isRunning || novo === modo) return;
    Haptics.selectionAsync();
    if (novo === 'foco') aplicarModo('foco', 1); else aplicarModo(novo, sessaoAtual);
  }
  function abrirConfig() { Haptics.selectionAsync(); setDraftConfig(config); setConfigModalVisible(true); }
  function salvarConfig() { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); setConfig(draftConfig); setConfigModalVisible(false); }

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
        <View style={styles.modeBadge}><Text style={[styles.modeText, { color: corProgresso }]}>{modoLabel}</Text></View>
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
        <Pressable style={styles.buttonReset} onPress={resetTimer}><Text style={styles.buttonResetText}>Reiniciar</Text></Pressable>
        <Pressable style={styles.buttonConfig} onPress={abrirConfig}><Text style={styles.buttonConfigText}>⚙️ Configurar tempos</Text></Pressable>
      </ScrollView>

      <Modal visible={configModalVisible} transparent animationType="fade" onRequestClose={() => setConfigModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Configurar Timer</Text>
            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              <ConfigTempo label="Foco" segundos={draftConfig.focoSeg} onChange={(v) => setDraftConfig({ ...draftConfig, focoSeg: v })} />
              <ConfigTempo label="Pausa curta" segundos={draftConfig.pausaCurtaSeg} onChange={(v) => setDraftConfig({ ...draftConfig, pausaCurtaSeg: v })} />
              <ConfigTempo label="Pausa longa" segundos={draftConfig.pausaLongaSeg} onChange={(v) => setDraftConfig({ ...draftConfig, pausaLongaSeg: v })} />
              <View style={styles.ciclosRow}>
                <Text style={styles.configLabel}>Ciclos por rodada</Text>
                <TextInput style={styles.configInputSmall} keyboardType="number-pad" value={String(draftConfig.ciclos)} onChangeText={(t) => {
                  const n = parseInt(t, 10);
                  if (!isNaN(n) && n > 0) setDraftConfig({ ...draftConfig, ciclos: n });
                  else if (t === '') setDraftConfig({ ...draftConfig, ciclos: 1 });
                }} />
              </View>
            </ScrollView>
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancel} onPress={() => setConfigModalVisible(false)}><Text style={styles.modalCancelText}>Cancelar</Text></Pressable>
              <Pressable style={styles.modalSave} onPress={salvarConfig}><Text style={styles.modalSaveText}>Salvar</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ConfigTempo({ label, segundos, onChange }: { label: string; segundos: number; onChange: (seg: number) => void }) {
  const { h, m, s } = segundosParaHMS(segundos);
  function alterar(campo: 'h' | 'm' | 's', texto: string) {
    const n = parseInt(texto, 10);
    const valor = isNaN(n) ? 0 : Math.max(0, n);
    const novo = campo === 'h' ? hmsParaSegundos(valor, m, s)
      : campo === 'm' ? hmsParaSegundos(h, valor, s)
      : hmsParaSegundos(h, m, valor);
    onChange(Math.max(1, novo));
  }
  return (
    <View style={styles.configTempoBloco}>
      <Text style={styles.configTempoLabel}>{label}</Text>
      <View style={styles.configTempoInputs}>
        <View style={styles.configInputWrapper}>
          <TextInput style={styles.configInputMini} keyboardType="number-pad" value={String(h)} onChangeText={(t) => alterar('h', t)} selectTextOnFocus />
          <Text style={styles.configInputSufixo}>h</Text>
        </View>
        <View style={styles.configInputWrapper}>
          <TextInput style={styles.configInputMini} keyboardType="number-pad" value={String(m)} onChangeText={(t) => alterar('m', t)} selectTextOnFocus />
          <Text style={styles.configInputSufixo}>min</Text>
        </View>
        <View style={styles.configInputWrapper}>
          <TextInput style={styles.configInputMini} keyboardType="number-pad" value={String(s)} onChangeText={(t) => alterar('s', t)} selectTextOnFocus />
          <Text style={styles.configInputSufixo}>s</Text>
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
  modoBtnFull: { width: '100%' }, modoBtnHalf: { flex: 1 },
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
  buttonStart: { backgroundColor: colors.primary }, buttonPause: { backgroundColor: colors.pause },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  buttonReset: { padding: 8 }, buttonResetText: { color: colors.primaryDarker, fontSize: 14, textDecorationLine: 'underline' },
  buttonConfig: { marginTop: 16, padding: 12 }, buttonConfigText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  modalBox: { backgroundColor: colors.white, borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  configTempoBloco: { backgroundColor: colors.primaryBg, borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  configTempoLabel: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 8 },
  configTempoInputs: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  configInputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  configInputMini: { flex: 1, textAlign: 'center', fontSize: 15, color: colors.text, paddingVertical: 4 },
  configInputSufixo: { fontSize: 12, color: colors.textMuted, marginLeft: 2 },
  configTempoPreview: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  ciclosRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4, marginTop: 4, marginBottom: 8 },
  configLabel: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  configInputSmall: { backgroundColor: colors.primaryBg, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, width: 70, textAlign: 'center', fontSize: 14, color: colors.text },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 12 },
  modalCancel: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.grayStroke, alignItems: 'center' },
  modalCancelText: { color: colors.textMuted, fontWeight: '600' },
  modalSave: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center' },
  modalSaveText: { color: colors.white, fontWeight: '600' },
});
