import { Task } from '../../../types';



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