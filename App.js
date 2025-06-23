import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Importe as telas de autenticação
import LoginScreen from './src/screens/LoginScreen';
import RecuperarSenhaScreen from './src/screens/RecuperarSenhaScreen';
import NovaSenhaScreen from './src/screens/NovaSenhaScreen';

import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import ResponderQuestionario from './src/screens/responderQuestionario';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RecuperarSenha" component={RecuperarSenhaScreen} />
      <Stack.Screen name="NovaSenha" component={NovaSenhaScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainApp" 
        component={BottomTabNavigator} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ResponderQuestionario" 
        component={ResponderQuestionario} 
        options={{ title: 'Respondendo Questionário' }} 
      /> 
    </Stack.Navigator>
  );
}

function RootNavigator() {
    const { signed, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#162B61" />
            </View>
        );
    }
  
    return signed ? <AppStack /> : <AuthStack />;
}


export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});