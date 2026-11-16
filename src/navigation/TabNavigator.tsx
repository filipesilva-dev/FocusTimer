import React from 'react';
import { Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import CustomTabBar from '../components/CustomTabBar';
import TimerScreen from '../routes/timer/TimerScreen';
import CardsScreen from '../routes/cards/CardsScreen';
import AgendaScreen from '../routes/agenda/AgendaScreen';
import GraficosScreen from '../routes/grafico/GraficosScreen';
import ConfiguracoesScreen from '../routes/configuracoes/ConfiguracoesScreen';

import TaskScreen from '../routes/tarefas/TaskScreen';
import TaskForm from '../routes/tarefas/TaskForm';
import TaskDetails from '../routes/tarefas/TaskDetails';
import { TarefasStackParamList } from '../types';

const Tab = createBottomTabNavigator();
const TasksStackNav = createNativeStackNavigator<TarefasStackParamList>();

function TarefasStack() {
  return (
    <TasksStackNav.Navigator>
      <TasksStackNav.Screen
        name="Tarefas"
        component={TaskScreen}
        options={{ title: 'Tarefas' }}
      />
      <TasksStackNav.Screen
        name="Nova Tarefa"
        component={TaskForm}
        options={{ presentation: 'modal', headerShown: false }}
      />
      <TasksStackNav.Screen
        name="TaskDetails"
        component={TaskDetails}
        options={({ navigation }) => ({
          title: 'Detalhes da Tarefa',
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Editar tarefa"
              hitSlop={8}
              onPress={() => navigation.navigate('Nova Tarefa')}
            >
              <Ionicons name="pencil" size={24} color="#333" />
            </Pressable>
          ),
        })}
      />
    </TasksStackNav.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Timer"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="TarefasTab" component={TarefasStack} />
      <Tab.Screen name="Cards" component={CardsScreen} />
      <Tab.Screen name="Timer" component={TimerScreen} />
      <Tab.Screen name="Agenda" component={AgendaScreen} />
      <Tab.Screen name="Graficos" component={GraficosScreen} />
      <Tab.Screen
        name="Configuracoes"
        component={ConfiguracoesScreen}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
}
