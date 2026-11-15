import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TarefasStackParamList } from '../../types';

type Props = NativeStackScreenProps<TarefasStackParamList, 'TaskDetails'>;

export default function TarefaDetails({ route }: Props) {
  const { task } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text>{task.className}</Text>
      <Text>{task.notes}</Text>
      <Text>
        {task.completedPomodoros}/{task.pomodoroAmount} pomodoros
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({

  //Alignment
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },


  //Styles
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});