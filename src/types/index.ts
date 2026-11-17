export type Task = {
  id: string;
  title: string;
  className: string;
  priority: number;
  pomodoroAmount: number;
  completedPomodoros: number;
  tempoEstudadoMinutos: number; // NOVO CAMPO
  date: string;
  status: boolean;
  notes: string;
};
