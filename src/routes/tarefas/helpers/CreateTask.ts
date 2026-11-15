import { Task } from '../../../types';



export function createTask(task: Omit<Task, "id">): Task {
  return {
    ...task,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  };
}

