import React from 'react';
import ProgressCard from './progressCard';

type DailyProgressCardProps = {
  progress: number;
  tasksTotal: number;
  totalTime: number;
  tasksCompleted: number;
};

export default function TaskProgressCard(props: DailyProgressCardProps) {
  return (
    <ProgressCard
      {...props}
      description="Progresso"
      caption1="Min estudados"
      caption2="Min restantes"
    />
  );
}