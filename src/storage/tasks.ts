import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

const TASKS_KEY = '@FocusTimer/tasks';

export function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false;
  const task = value as Record<string, unknown>;
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.className === 'string' &&
    typeof task.priority === 'number' &&
    typeof task.pomodoroAmount === 'number' &&
    typeof task.completedPomodoros === 'number' &&
    typeof task.date === 'string' &&
    typeof task.status === 'boolean' &&
    typeof task.notes === 'string'
  );
}

export async function loadTasks(): Promise<Task[]> {
  try {
    const saved = await AsyncStorage.getItem(TASKS_KEY);
    if (saved === null) return [];
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.every(isTask)) {
      console.warn('Saved tasks have an invalid format');
      return [];
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load tasks:', e);
    return [];
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks:', e);
  }
}

export function createTask(task: Omit<Task, "id">): Task {
  return {
    ...task,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  };
}
