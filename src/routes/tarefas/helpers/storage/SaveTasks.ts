import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../../../../types';

const TASKS_KEY = '@FocusTimer/tasks'; // mesma chave do LoadTasks

export async function saveTasks(tasks: Task[]) {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}
