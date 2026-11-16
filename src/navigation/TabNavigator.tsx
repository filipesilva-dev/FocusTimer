import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from '../components/CustomTabBar';
import TimerScreen from '../routes/timer/TimerScreen';
import CardsScreen from '../routes/cards/CardsScreen';
import AgendaScreen from '../routes/agenda/AgendaScreen';
import ConfiguracoesScreen from '../routes/configuracoes/ConfiguracoesScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Timer" backBehavior="history" tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Cards" component={CardsScreen} />
      <Tab.Screen name="Timer" component={TimerScreen} />
      <Tab.Screen name="Agenda" component={AgendaScreen} />
      <Tab.Screen name="Configuracoes" component={ConfiguracoesScreen} options={{ tabBarButton: () => null }} />
    </Tab.Navigator>
  );
}
