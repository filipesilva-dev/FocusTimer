import AsyncStorage from '@react-native-async-storage/async-storage';

export type Config = { focoSeg: number; pausaCurtaSeg: number; pausaLongaSeg: number; ciclos: number };

export const CONFIG_PADRAO: Config = {
  focoSeg: 25 * 60,
  pausaCurtaSeg: 5 * 60,
  pausaLongaSeg: 15 * 60,
  ciclos: 4,
};

const CHAVE_CONFIG = '@FocusTimer/timerConfig';

export async function salvarTimerConfig(config: Config): Promise<void> {
  try {
    await AsyncStorage.setItem(CHAVE_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.warn('[storage] erro ao salvar timerConfig:', e);
  }
}

export async function lerTimerConfig(): Promise<Config> {
  try {
    const json = await AsyncStorage.getItem(CHAVE_CONFIG);
    if (!json) return CONFIG_PADRAO;
    return JSON.parse(json) as Config;
  } catch (e) {
    console.warn('[storage] erro ao ler timerConfig:', e);
    return CONFIG_PADRAO;
  }
}
