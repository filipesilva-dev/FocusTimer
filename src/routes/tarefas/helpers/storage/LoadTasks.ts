
import { Task } from '../../../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isTask } from '../ValidateTask';

const TASKS_KEY = '@FocusTimer/tasks';

export async function loadTasks(): Promise<Task[]> {
  const saved = await AsyncStorage.getItem(TASKS_KEY);
  if (saved === null) return [];

  const parsed: unknown = JSON.parse(saved);

  if (!Array.isArray(parsed) || !parsed.every(isTask)) {
    throw new Error('Saved tasks have an invalid format');
  }

  return parsed;
}

