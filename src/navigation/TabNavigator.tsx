import React from 'react';
import { Platform, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import TimerScreen from '../screens/TimerScreen';
import TarefasScreen from '../screens/TarefasScreen';
import CardsScreen from '../screens/CardsScreen';
import AgendaScreen from '../screens/AgendaScreen';
import GraficosScreen from '../screens/GraficosScreen';

const Tab = createBottomTabNavigator();

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
        name="Tarefas"
        component={TarefasScreen}
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
