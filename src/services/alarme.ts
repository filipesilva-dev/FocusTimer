import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import { Vibration, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const SOM_ALARME = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';
let player: AudioPlayer | null = null;

export async function tocarAlarme(): Promise<void> {
  try {
    Vibration.vibrate([0, 400, 200, 400, 200, 400]);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (e) { console.warn('[alarme] vibração:', e); }

  try {
    await setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false });
    if (player) { player.release(); player = null; }
    
    player = createAudioPlayer(SOM_ALARME);
    player.play();
    
    setTimeout(() => {
      if (player) { player.release(); player = null; }
    }, 3000);
  } catch (e) { console.warn('[alarme] som:', e); }

  if (Platform.OS === 'android') setTimeout(() => Vibration.vibrate(200), 500);
}

export async function pararAlarme(): Promise<void> {
  try {
    Vibration.cancel();
    if (player) { player.release(); player = null; }
  } catch (e) { console.warn('[alarme] parar:', e); }
}
