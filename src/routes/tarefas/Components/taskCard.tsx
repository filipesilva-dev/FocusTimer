import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Checkbox } from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Task, TarefasStackParamList } from '../../../types';

type Navigation = NativeStackNavigationProp<TarefasStackParamList, 'Tarefas'>;

const priorityLabels: Record<number, string> = {
  1: 'Baixa',
  2: 'Média',
  3: 'Alta',
  4: 'Finalizada',
};

type TaskCardProps = {
  task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
  const navigation = useNavigation<Navigation>();

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.cardContent}
        onPress={() => navigation.navigate('TaskDetails', { task })}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalhes de ${task.title}`}
      >
      <View style={styles.titleContainer}>
        <Checkbox value ={task.status} />
        <Text style={task.status ? styles.titleCompleted : styles.title}>{task.title} - {task.className}</Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>{task.completedPomodoros}/{task.pomodoroAmount} pomodoros - {priorityLabels[task.priority]}</Text>
      </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({

  //Alignment
   container: {
    width: '80%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#d6d6d6',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',

    gap: 10,
  },
  descriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    paddingLeft: 30,
  },
  cardContent: {
    
  },


  //Styling
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  titleCompleted: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#999',
    textDecorationLine: 'line-through',
  },
  descriptionText: {
    fontSize: 18,
    color: '#666',
  },
});