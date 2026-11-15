export type TabParamList = {
  Tarefas: undefined;
  Cards: undefined;
  Timer: undefined;
  Agenda: undefined;
  Graficos: undefined;
};


export type Task = {
  id: string;
  title: string;
  className: string;
  priority: number;
  pomodoroAmount: number;
  completedPomodoros: number;
  date: string;
  status: boolean;
  notes: string;
}


export type TarefasStackParamList = {
  Tarefas: undefined;
  'Nova Tarefa': undefined;
  TaskDetails: { task: Task };
};