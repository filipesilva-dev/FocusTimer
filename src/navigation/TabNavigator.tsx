import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomTabBar from '../components/CustomTabBar';
import TimerScreen from '../routes/timer/TimerScreen';
import TarefasScreen from '../routes/tarefas/TarefasScreen';
import NewTarefaModal from '../routes/tarefas/NewTarefaModal';
import TarefaDetails from '../routes/tarefas/TarefaDetails';
import CardsScreen from '../screens/CardsScreen';
import AgendaScreen from '../screens/AgendaScreen';
import GraficosScreen from '../screens/GraficosScreen';
import ConfiguracoesScreen from '../routes/configuracoes/ConfiguracoesScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TarefasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TarefasLista" component={TarefasScreen} />
      <Stack.Screen name="NovaTarefa" component={NewTarefaModal} options={{ presentation: 'modal' }} />
      <Stack.Screen name="TarefaDetalhes" component={TarefaDetails} />
    </Stack.Navigator>
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
