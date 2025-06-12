import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from './src/screens/Dashboard'; 
import Historico from './src/screens/Historico'; 
import BottomTabNavigator from './src/navigation/BottomTabNavigator';


const Stack = createStackNavigator();

export default function App() {
  return <BottomTabNavigator />;
}
