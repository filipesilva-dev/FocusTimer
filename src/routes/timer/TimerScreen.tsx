import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, Modal, TextInput, ScrollView } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import Header from '../../components/Header';
import { colors } from '../../theme/colors';

type Modo = 'foco' | 'pausaCurta' | 'pausaLonga';
type Config = { foco: number; pausaCurta: number; pausaLonga: number; ciclos: number };
const CONFIG_PADRAO: Config = { foco: 25, pausaCurta: 5, pausaLonga: 15, ciclos: 4 };

function minutosDoModo(m: Modo, c: Config): number {
  if (m === 'foco') return c.foco;
  if (m === 'pausaCurta') return c.pausaCurta;
  return c.pausaLonga;
}

export default function TimerScreen() {
  const { width } = useWindowDimensions();
  const [config, setConfig] = useState<Config>(CONFIG_PADRAO);
  const [modo, setModo] = useState<Modo>('foco');
  const [sessaoAtual, setSessaoAtual] = useState(1);
  const [timeLeft, setTimeLeft] = useState(CONFIG_PADRAO.foco * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [draftConfig, setDraftConfig] = useState<Config>(CONFIG_PADRAO);
  const totalTime = minutosDoModo(modo, config) * 60;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isRunning]);

  useEffect(() => {
    if (!isRunning) setTimeLeft(minutosDoModo(modo, config) * 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  function aplicarModo(novoModo: Modo, novaSessao: number) {
    setModo(novoModo);
    setSessaoAtual(novaSessao);
    setTimeLeft(minutosDoModo(novoModo, config) * 60);
  }

  function avancarCiclo() {
    if (modo === 'foco') {
      if (sessaoAtual >= config.ciclos) aplicarModo('pausaLonga', 1);
      else aplicarModo('pausaCurta', sessaoAtual + 1);
    } else {
      aplicarModo('foco', sessaoAtual);
    }
  }

  function toggleTimer() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRunning((p) => !p);
  }

  function resetTimer() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRunning(false);
    setTimeLeft(minutosDoModo(modo, config) * 60);
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

  function salvarConfig() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setConfig(draftConfig);
    setConfigModalVisible(false);
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
      <Modal visible={configModalVisible} transparent animationType="fade" onRequestClose={() => setConfigModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Configurar Timer</Text>
            <ConfigRow label="Foco (min)" value={draftConfig.foco} onChange={(v) => setDraftConfig({ ...draftConfig, foco: v })} />
            <ConfigRow label="Pausa curta (min)" value={draftConfig.pausaCurta} onChange={(v) => setDraftConfig({ ...draftConfig, pausaCurta: v })} />
            <ConfigRow label="Pausa longa (min)" value={draftConfig.pausaLonga} onChange={(v) => setDraftConfig({ ...draftConfig, pausaLonga: v })} />
            <ConfigRow label="Ciclos por rodada" value={draftConfig.ciclos} onChange={(v) => setDraftConfig({ ...draftConfig, ciclos: v })} />
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancel} onPress={() => setConfigModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.modalSave} onPress={salvarConfig}>
                <Text style={styles.modalSaveText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ConfigRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <View style={styles.configRow}>
      <Text style={styles.configLabel}>{label}</Text>
      <TextInput style={styles.configInput} keyboardType="number-pad" value={String(value)} onChangeText={(t) => { const n = parseInt(t, 10); if (!isNaN(n) && n > 0) onChange(n); else if (t === '') onChange(1); }} />
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
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  modalBox: { backgroundColor: colors.white, borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  configRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  configLabel: { fontSize: 13, color: colors.textMuted },
  configInput: { backgroundColor: colors.primaryBg, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, width: 80, textAlign: 'center', fontSize: 14, color: colors.text },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 12 },
  modalCancel: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.grayStroke, alignItems: 'center' },
  modalCancelText: { color: colors.textMuted, fontWeight: '600' },
  modalSave: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center' },
  modalSaveText: { color: colors.white, fontWeight: '600' },
});
