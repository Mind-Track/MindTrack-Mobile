import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function Dashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bem-vindo ao Dashboard!</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Histórico"
          onPress={() => navigation.navigate('Histórico')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  buttonContainer: {
    position: 'absolute',  // Posiciona o contêiner do botão de forma absoluta
    bottom: 20,            // 20px acima da parte inferior
    right: 20,             // 20px à esquerda da borda direita
    zIndex: 1,             // Garante que o botão fique acima dos outros componentes
  },
  text: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});
