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

export default function Dashboard({ navigation }) {
  const [checkInStates, setCheckInStates] = useState([false, false, false, false, false]);
  const [selectedButton, setSelectedButton] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadCheckInState();
  }, []);

  const selectButton = (index) => {
    setSelectedButton(index);
  };

  const submitCheckIn = () => {
    if (selectedButton === null) {
      Alert.alert('Erro', 'Selecione um botão antes de enviar!');
      return;
    }

    const updatedCheckInStates = [...checkInStates];
    updatedCheckInStates[selectedButton] = true;

    const checkInLog = {
      button: selectedButton + 1,
      status: updatedCheckInStates[selectedButton],
      comment,
      timestamp: new Date().toISOString(),
    };

    setCheckInStates(updatedCheckInStates);
    saveCheckInState(updatedCheckInStates);
    logCheckIn(checkInLog);

    // Resetar campos
    setSelectedButton(null);
    setComment('');

    Alert.alert('Sucesso', 'Check-in enviado com sucesso!');
    console.log('Check-in enviado:', checkInLog);
  };

  const saveCheckInState = (states) => {
    localStorage.setItem('checkInStates', JSON.stringify(states));
  };

  const loadCheckInState = () => {
    const savedStates = JSON.parse(localStorage.getItem('checkInStates') || '[]');
    if (savedStates.length) {
      setCheckInStates(savedStates);
    }
  };

  const logCheckIn = (log) => {
    let checkInLogs = JSON.parse(localStorage.getItem('checkInLogs') || '[]');
    checkInLogs.push(log);
    localStorage.setItem('checkInLogs', JSON.stringify(checkInLogs));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Check-in Diário */}
      <View style={styles.section}>
        <Text style={styles.title}>Check-in Diário</Text>
        <View style={styles.buttonGroup}>
          {checkInStates.map((state, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.checkInButton,
                selectedButton === index && styles.activeButton,
              ]}
              onPress={() => selectButton(index)}
            >
              <Text style={styles.buttonText}>{index + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="Faça um comentário..."
          multiline
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity
          style={[
            styles.submitButton,
            selectedButton === null && styles.disabledButton,
          ]}
          onPress={submitCheckIn}
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
          Aqui vai o texto explicativo ou informativo relevante para o usuário. Você pode adicionar mais informações conforme necessário.
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
  noSurveys: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
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
});
