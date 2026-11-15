import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

type ProgressCardProps = {
  progress: number;
  tasksTotal: number;
  totalTime: number;
};

export default function ProgressCard({ progress, tasksTotal, totalTime }: ProgressCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progresso da hoje</Text>
      <ProgressBar progress={progress} style={styles.progressBar} />
      <Text>
        {tasksTotal} tarefas, {totalTime} minutos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBar: {
    width: '80%',
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
  },
});