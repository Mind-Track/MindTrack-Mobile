import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Dashboard from '../screens/Dashboard';
import Historico from '../screens/Historico';
import MaterialApoio from '../screens/MaterialApoio';
import Questionarios from '../screens/Questionarios';
import { Ionicons } from '@expo/vector-icons'; // ícones bonitos!

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;

                        switch (route.name) {
                            case 'Dashboard':
                                iconName = 'home';
                                break;
                            case 'Histórico':
                                iconName = 'time';
                                break;
                            case 'Material de Apoio':
                                iconName = 'book';
                                break;
                            case 'Questionários':
                                iconName = 'list';
                                break;
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#89CFF0',      // azul claro para ícones/textos ativos
                    tabBarInactiveTintColor: '#A0B5D9',    // azul clarinho meio desativado para inativos
                    tabBarStyle: {
                        backgroundColor: '#162B61',          // azul escuro da barra
                        height: 70,
                        paddingBottom: 8,
                        borderTopWidth: 0,
                        elevation: 10,                       // sombra no Android
                        shadowColor: '#000',                 // sombra no iOS
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 0, height: -3 },
                        shadowRadius: 4,
                    },
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: '600',
                        color: '#89CFF0',                    // azul claro nos labels (não obrigatório, pode herdar do tintColor)
                    },
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Dashboard" component={Dashboard} />
                <Tab.Screen name="Histórico" component={Historico} />
                <Tab.Screen name="Material de Apoio" component={MaterialApoio} />
                <Tab.Screen name="Questionários" component={Questionarios} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}