import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TaskCard from './Components/taskCard';
import DailyProgressCard from './Components/progressCards/dailyProgress';
import { Task } from '../../types';
import { loadTasks } from './helpers/storage/LoadTasks';
import { createTask } from './helpers/CreateTask';

export default function TarefasScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const loadedTasks = await loadTasks();
        if (active) setTasks(loadedTasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
        if (active) setLoadError('Could not load saved tasks.');
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  const dailyProgress = getDailyProgress(tasks);

  return (
    <View style={styles.container}>
      {loadError && <Text>{loadError}</Text>}
      <DailyProgressCard {...dailyProgress} />
      {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
    </View>
  );
}

function getDailyProgress(tasks: Task[], date = new Date()) {
  const today = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');

  const todaysTasks = tasks.filter(task => task.date === today);
  const tasksTotal = todaysTasks.length;
  const tasksCompleted = todaysTasks.filter((task) => task.status).length;

  return {
    tasksTotal,
    tasksCompleted,
    progress: tasksTotal === 0 ? 0 : tasksCompleted / tasksTotal,
    // TimerScreen uses 25-minute focus sessions.
    totalTime: todaysTasks.reduce(
      (sum, task) => sum + task.completedPomodoros * 25,
      0,
    ),
  };
}



const mockTask: Task = createTask({
  title: 'Estudar React Native',
  className: 'Programação',
  priority: 2,
  pomodoroAmount: 4,
  completedPomodoros: 2,
  date: '2024-06-15',
  status: false,
  notes: 'Revisar conceitos de hooks e navegação.',
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
