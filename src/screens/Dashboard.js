import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { submitCheckIn } from '../services/checkinService';
import { Image } from 'react-native';

// Importe as imagens manualmente
const emojis = [
  require('../assets/images/emojis1.png'),
  require('../assets/images/emojis2.png'),
  require('../assets/images/emojis3.png'),
  require('../assets/images/emojis4.png'),
  require('../assets/images/emojis5.png'),
];


export default function Dashboard({ navigation }) {
  const [selectedButton, setSelectedButton] = useState(null);
  const [comment, setComment] = useState('');

  // Função para selecionar um botão
  const selectButton = (index) => {
    setSelectedButton(index);
  };

  // Função para enviar o check-in
  const handleSubmitCheckIn = async () => {
    // Valida se o botão foi selecionado
    if (selectedButton === null) {
      Alert.alert('Erro', 'Selecione um botão antes de enviar!');
      return;
    }

    // Dados do check-in
    const checkInData = {
      idFuncionario: 1, 
      nivelHumor: selectedButton + 1, 
      comentario: comment,
      dataHora: new Date().toISOString(), 
    };

    try {
      // Envia os dados do check-in para o backend
      await submitCheckIn(checkInData);
      Alert.alert('Sucesso', 'Check-in enviado com sucesso!');
      setSelectedButton(null); // Reseta a seleção do botão
      setComment(''); // Limpa o campo de comentário
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar o check-in.');
      console.error('Erro ao enviar check-in:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Check-in Diário */}
      <View style={styles.section}>
        <Text style={styles.title}>Check-in Diário</Text>
        <View style={styles.buttonGroup}>
          {emojis.map((emoji, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.checkInButton,
                selectedButton === index && styles.activeButton,
              ]}
              onPress={() => selectButton(index)}
            >
              <Image source={emoji} style={styles.image} />
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="Adicione um comentário..."
          multiline
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity
          style={[styles.submitButton, selectedButton === null && styles.disabledButton]}
          onPress={handleSubmitCheckIn}
          disabled={selectedButton === null}
        >
          <Text style={styles.submitText}>Enviar</Text>
        </TouchableOpacity>
      </View>

      {/* Questionários Pendentes */}
      <View style={styles.section}>
        <Text style={styles.title}>Questionários Pendentes</Text>
        <Text style={styles.noSurveys}>Parabéns! Não há questionários pendentes!</Text>
      </View>

      {/* Dica de Saúde do Dia */}
      <View style={styles.section}>
        <Text style={styles.title}>Dica de Saúde do Dia</Text>
        <Text style={styles.tip}>
          Reserve 10 minutos do seu dia para meditar e cuidar de sua saúde mental.
        </Text>
      </View>

      <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <Button
              title="Histórico"
              onPress={() => navigation.navigate('Histórico')}
            />
          </View>
          </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#89CFF0',
    padding: 20,
  },
  section: {
    backgroundColor: '#366AEE',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  checkInButton: {
    backgroundColor: '#ffffff',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#244a9c',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    height: 80,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#244a9c',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#d3d3d3',
  },
  tip: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1,
  },
  historyButton: {
    backgroundColor: '#244a9c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 50,  
    height: 50, 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    borderRadius: 50,
  },
});
