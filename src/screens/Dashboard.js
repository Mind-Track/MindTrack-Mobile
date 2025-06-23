import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    Image,
    ActivityIndicator
} from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { submitCheckIn } from '../services/checkinService';
import { listarMateriais } from '../services/materiaisService';
import { listarQuestionariosPorFuncionario } from '../services/questionarioService';

const emojis = [
    require('../assets/images/emojis1.png'),
    require('../assets/images/emojis2.png'),
    require('../assets/images/emojis3.png'),
    require('../assets/images/emojis4.png'),
    require('../assets/images/emojis5.png'),
];

export default function Dashboard({ navigation }) {
    const { user } = useAuth();

    const [selectedButton, setSelectedButton] = useState(null);
    const [comment, setComment] = useState('');
    
    const [dicaDoDia, setDicaDoDia] = useState(null);
    const [questionarios, setQuestionarios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarDadosDashboard = async () => {
            if (!user) return; 

            try {
                // Carregar Materiais para a Dica do Dia
                const materiais = await listarMateriais();
                if (materiais && materiais.length > 0) {
                    const dia = new Date().getDate();
                    const indiceDica = dia % materiais.length; 
                    setDicaDoDia(materiais[indiceDica]);
                }

                // Carregar Questionários Pendentes
                const todosQuestionarios = await listarQuestionariosPorFuncionario(user.id);
                const naoRespondidos = todosQuestionarios
                    .filter(q => !q.respondido)
                    .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
                    .slice(0, 3); 
                setQuestionarios(naoRespondidos);

            } catch (error) {
                Alert.alert("Erro", "Não foi possível carregar os dados do dashboard.");
            } finally {
                setLoading(false);
            }
        };

        carregarDadosDashboard();
    }, [user]); 

    const selectButton = (index) => {
        setSelectedButton(index);
    };

    const handleSubmitCheckIn = async () => {
        if (selectedButton === null) {
            Alert.alert('Erro', 'Selecione um emoji para o seu humor hoje!');
            return;
        }

        const checkInData = {
            idFuncionario: user.id,
            humorLevel: selectedButton + 1, 
            comment: comment,
            dateTime: new Date().toISOString(),
        };

        try {
            await submitCheckIn(checkInData);
            Alert.alert('Sucesso', 'Check-in enviado com sucesso!');
            setSelectedButton(null);
            setComment('');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível enviar o check-in.');
            console.error('Erro ao enviar check-in:', error);
        }
    };

    if (loading) {
        return <View style={styles.container}><ActivityIndicator size="large" color="#FFF" /></View>;
    }

    return (
        <ScrollView style={styles.container}>
            {/* Check-in Diário (a lógica interna não muda) */}
            <View style={styles.section}>
                {/* ... seu código de check-in ... */}
            </View>

            {/* Questionários Pendentes - AGORA DINÂMICO */}
            <View style={styles.section}>
                <Text style={styles.title}>Questionários Pendentes</Text>
                {questionarios.length > 0 ? (
                    questionarios.map(q => (
                        <TouchableOpacity 
                            key={q.id} 
                            style={styles.questionarioItem} 
                            onPress={() => navigation.navigate('ResponderQuestionario', { questionarioId: q.id })}
                        >
                            <Text style={styles.questionarioTitle}>{q.title}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noSurveys}>Parabéns! Não há questionários pendentes!</Text>
                )}
            </View>

            {/* Dica de Saúde do Dia */}
            <View style={styles.section}>
                <Text style={styles.title}>Dica de Saúde do Dia</Text>
                {dicaDoDia ? (
                    <TouchableOpacity onPress={() => navigation.navigate('Material de Apoio')}>
                        <Text style={styles.tipTitle}>{dicaDoDia.title}</Text>
                        <Text style={styles.tip}>{dicaDoDia.content}</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.tip}>Nenhuma dica disponível hoje.</Text>
                )}
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
