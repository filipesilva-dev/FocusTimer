import React from 'react';
import { Pressable, Platform, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { Ionicons } from '@expo/vector-icons';

import TimerScreen from '../routes/timer/TimerScreen';
import CardsScreen from '../routes/cards/CardsScreen';
import AgendaScreen from '../routes/agenda/AgendaScreen';
import GraficosScreen from '../routes/grafico/GraficosScreen';
import { TarefasStackParamList } from '../types';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();




function renderLabel(label: string, color: string) {
  return (
    <Text
      numberOfLines={2}
      adjustsFontSizeToFit
      minimumFontScale={0.6}
      allowFontScaling={false}
      style={{
        fontSize: 14,
        fontWeight: '600',
        color,
        textAlign: 'center',
        width: '100%',
      }}
    >
      {label}
    </Text>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Timer"
      screenOptions={({ route }) => ({
          headerShown: false,
          tabBarLabelPosition: 'below-icon',
        tabBarIcon: ({ focused, color }) => {
          let iconName: any;

          if (route.name === 'Tarefas') iconName = focused ? 'checkbox' : 'checkbox-outline';
          else if (route.name === 'Cards') iconName = focused ? 'albums' : 'albums-outline';
          else if (route.name === 'Timer') iconName = focused ? 'timer' : 'timer-outline';
          else if (route.name === 'Agenda') iconName = focused ? 'calendar' : 'calendar-outline';
          else iconName = focused ? 'bar-chart' : 'bar-chart-outline';

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: '#333',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 92 : 78,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 36 : 20,
        },
        tabBarItemStyle: {
          paddingHorizontal: 0,
          paddingVertical: 0,
        },
      })}
    >
      <Tab.Screen
        name="TarefasTab"
        component={TarefasStack}
        options={{ tabBarLabel: ({ color }) => renderLabel('Tarefas', color) }}
      />
      <Tab.Screen
        name="Cards"
        component={CardsScreen}
        options={{ tabBarLabel: ({ color }) => renderLabel('Cards', color) }}
      />
      <Tab.Screen
        name="Timer"
        component={TimerScreen}
        options={{ tabBarLabel: ({ color }) => renderLabel('Timer', color) }}
      />
      <Tab.Screen
        name="Agenda"
        component={AgendaScreen}
        options={{ tabBarLabel: ({ color }) => renderLabel('Agenda', color) }}
      />
      <Tab.Screen
        name="Graficos"
        component={GraficosScreen}
        options={{ tabBarLabel: ({ color }) => renderLabel('Gráficos', color) }}
      />
    </Tab.Navigator>
  );
}


import TaskScreen from '../routes/tarefas/TaskScreen';
import TaskForm from '../routes/tarefas/TaskForm';
import TaskDetails from '../routes/tarefas/TaskDetails';
const TasksStack = createNativeStackNavigator<TarefasStackParamList>();

function TarefasStack() {
  return(
    <TasksStack.Navigator>
      <TasksStack.Screen name="Tarefas" component={TaskScreen} options={({ navigation }) => ({
        title: 'Tarefas', headerRight: () => (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Nova tarefa"
        hitSlop={8}
        onPress={() => navigation.navigate('Nova Tarefa')}
      >
        <Ionicons name="add" size={24} color="#333" />
      </Pressable>
    )
      })}/>
      <TasksStack.Screen name="Nova Tarefa" component={TaskForm} options={{ presentation: 'modal', headerShown: false }} />
      <TasksStack.Screen name="TaskDetails" component={TaskDetails} options={({ navigation }) => ({
        title: 'Detalhes da Tarefa', headerRight: () => (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Editar tarefa"
        hitSlop={8}
        onPress={() => navigation.navigate('Nova Tarefa')}
      >
        <Ionicons name="pencil" size={24} color="#333" />
      </Pressable> )
    })} />
    </TasksStack.Navigator>
  )
}
