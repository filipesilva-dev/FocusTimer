import React from 'react';
import ProgressCard from './progressCard';

type DailyProgressCardProps = {
  progress: number;
  tasksTotal: number;
  totalTime: number;
  tasksCompleted: number;
};

export default function DailyProgressCard(props: DailyProgressCardProps) {
  return (
    <ProgressCard
      {...props}
      description="Progresso de hoje"
      caption1=" tarefas"
      caption2=" minutos"
    />
  );
}