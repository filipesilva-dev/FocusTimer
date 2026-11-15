import { Audio } from 'expo-av';
import { Vibration, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const SOM_ALARME = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';
let somCarregado: Audio.Sound | null = null;
let audioConfigurado = false;

async function configurarAudio() {
  if (audioConfigurado) return;
  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, shouldDuckAndroid: true, staysActiveInBackground: false });
    audioConfigurado = true;
  } catch (e) { console.warn('[alarme] config:', e); }
}

export async function tocarAlarme(): Promise<void> {
  try {
    Vibration.vibrate([0, 400, 200, 400, 200, 400]);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (e) { console.warn('[alarme] vibração:', e); }

  try {
    await configurarAudio();
    if (somCarregado) { try { await somCarregado.unloadAsync(); } catch {} somCarregado = null; }
    const { sound } = await Audio.Sound.createAsync({ uri: SOM_ALARME }, { shouldPlay: true, volume: 0.7, isLooping: false });
    somCarregado = sound;
    setTimeout(async () => {
      try { await sound.unloadAsync(); if (somCarregado === sound) somCarregado = null; } catch {}
    }, 3000);
  } catch (e) { console.warn('[alarme] som:', e); }

  if (Platform.OS === 'android') setTimeout(() => Vibration.vibrate(200), 500);
}

export async function pararAlarme(): Promise<void> {
  try {
    Vibration.cancel();
    if (somCarregado) { await somCarregado.stopAsync(); await somCarregado.unloadAsync(); somCarregado = null; }
  } catch (e) { console.warn('[alarme] parar:', e); }
}
