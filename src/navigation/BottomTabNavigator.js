import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/Dashboard';
import Historico from '../screens/Historico';
import MaterialApoio from '../screens/MaterialApoio';
import Questionarios from '../screens/Questionarios';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Dashboard':
                            iconName = 'home-outline';
                            break;
                        case 'Histórico':
                            iconName = 'time-outline';
                            break;
                        case 'Material de Apoio':
                            iconName = 'book-outline';
                            break;
                        case 'Questionários':
                            iconName = 'list-outline';
                            break;
                        default:
                            iconName = 'ellipse-outline'; 
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#89CFF0',
                tabBarInactiveTintColor: '#A0B5D9',
                tabBarStyle: {
                    backgroundColor: '#162B61',
                    height: 70,
                    paddingBottom: 8,
                    borderTopWidth: 0,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOpacity: 0.3,
                    shadowOffset: { width: 0, height: -3 },
                    shadowRadius: 4,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
                headerShown: true, 
                headerStyle: {
                    backgroundColor: '#162B61', 
                },
                headerTintColor: '#FFFFFF' 
            })}
        >
            <Tab.Screen name="Dashboard" component={Dashboard} />
            <Tab.Screen name="Histórico" component={Historico} />
            <Tab.Screen name="Material de Apoio" component={MaterialApoio} />
            <Tab.Screen name="Questionários" component={Questionarios} />
        </Tab.Navigator>
    );
}