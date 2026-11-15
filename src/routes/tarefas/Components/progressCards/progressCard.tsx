import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

type ProgressCardProps = {
  progress: number;
  tasksTotal: number;
  totalTime: number;
  tasksCompleted: number;
  description: string;
  caption1: string;
  caption2: string;
};

export default function ProgressCard({ progress, tasksTotal, totalTime, tasksCompleted, description, caption1, caption2 }: ProgressCardProps) {
  return (
    <View style={styles.container}>
        <View style={styles.titleContainer}>
            <Text style={styles.title}>{description}</Text>
            <Text style={styles.completedText}>{tasksCompleted}/{tasksTotal}</Text>
        </View>
      <View style={styles.progressBarContainer}>
        <ProgressBar progress={progress} color='#5a5a5a' style={styles.progressBar} />
      </View>
      <Text style={styles.descriptionText}>
        {tasksTotal}{caption1}, {totalTime}{caption2}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
    //Alignment
  container: {
    width: '80%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#d6d6d6', 
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 10,
  },
  progressBarContainer: {
  width: '100%',
  paddingBottom: 10,
},

  //Styling
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  completedText: {
    fontSize: 20,
    color: '#4d4d4d',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
  },
  progressBar: {
    height: 20,
    backgroundColor: '#d6d6d6',
    borderRadius: 10,
  },
});