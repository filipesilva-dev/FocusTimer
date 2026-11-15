import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';

export default function TimerScreen() {
  const { width, height } = useWindowDimensions();

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'foco' | 'pausa'>('foco');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === 'foco') {
        setMode('pausa');
        setTimeLeft(5 * 60);
      } else {
        setMode('foco');
        setTimeLeft(25 * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'foco' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Tamanho do círculo escalável — nunca maior que 70% da largura nem que 260px
  const circleSize = Math.min(width * 0.7, 260);
  const fontSize = Math.min(width * 0.16, 64);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>FocusTimer</Text>

      <View style={styles.modeBadge}>
        <Text style={styles.modeText}>
          {mode === 'foco' ? '🎯 MODO FOCO' : '☕ MODO PAUSA'}
        </Text>
      </View>

      <View
        style={[
          styles.timerCircle,
          { width: circleSize, height: circleSize, borderRadius: circleSize / 2 },
        ]}
      >
        <Text style={[styles.timerText, { fontSize }]}>{formattedTime}</Text>
      </View>

      <View style={styles.controls}>
        <Pressable
          style={[styles.button, isRunning ? styles.buttonPause : styles.buttonStart]}
          onPress={toggleTimer}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'PAUSAR' : 'INICIAR'}
          </Text>
        </Pressable>

        <Pressable style={styles.buttonReset} onPress={resetTimer}>
          <Text style={styles.buttonResetText}>Reiniciar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    marginBottom: 12,
  },
  modeBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  modeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555',
  },
  timerCircle: {
    backgroundColor: '#F7F7F7',
    borderWidth: 3,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  timerText: {
    fontWeight: 'bold',
    color: '#333',
  },
  controls: {
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '80%',
    maxWidth: 240,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonStart: {
    backgroundColor: '#333',
  },
  buttonPause: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonReset: {
    padding: 8,
  },
  buttonResetText: {
    color: '#888',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
