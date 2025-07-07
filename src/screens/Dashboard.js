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
                const materiais = await listarMateriais();
                if (materiais && materiais.length > 0) {
                    const dia = new Date().getDate();
                    const indiceDica = dia % materiais.length; 
                    setDicaDoDia(materiais[indiceDica]);
                }

                const todosQuestionarios = await listarQuestionariosPorFuncionario(user.id);

                // Apenas os válidos ainda dentro da data de validade
                const hoje = new Date();
                const validos = todosQuestionarios.filter(q => new Date(q.dataValidade) >= hoje);

                const questionariosOrdenados = validos
                    .sort((a, b) => new Date(b.dataValidade) - new Date(a.dataValidade))
                    .slice(0, 3);

                setQuestionarios(questionariosOrdenados);

            } catch (error) {
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
            nivelHumor: selectedButton + 1,
            comentario: comment,
            dataHora: new Date().toISOString(),
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
            {/* Seção Check-in Diário */}
            <View style={styles.section}>
                <Text style={styles.title}>Como você está se sentindo hoje?</Text>
                <View style={styles.buttonGroup}>
                    {emojis.map((emoji, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => selectButton(index)}
                            style={[
                                styles.checkInButton,
                                selectedButton === index && styles.activeButton,
                            ]}
                        >
                            <Image source={emoji} style={styles.image} />
                        </TouchableOpacity>
                    ))}
                </View>
                <TextInput
                    style={styles.textInput}
                    placeholder="Comentário (opcional)"
                    value={comment}
                    onChangeText={setComment}
                    multiline
                />
                <TouchableOpacity
                    style={[styles.submitButton, selectedButton === null && styles.disabledButton]}
                    onPress={handleSubmitCheckIn}
                    disabled={selectedButton === null}
                >
                    <Text style={styles.submitText}>Enviar Check-in</Text>
                </TouchableOpacity>
            </View>

            {/* Seção Questionários Pendentes */}
            <View style={styles.section}>
                <Text style={styles.title}>Questionários Pendentes</Text>
                {questionarios.length > 0 ? (
                    questionarios.map(q => (
                        <TouchableOpacity 
                            key={q.id} 
                            style={styles.questionarioItem} 
                            onPress={() => navigation.navigate('ResponderQuestionario', { questionarioId: q.id })}
                        >
                            <Text style={styles.questionarioTitle}>{q.titulo}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noSurveys}>Parabéns! Não há questionários pendentes!</Text>
                )}
            </View>

            {/* Seção Dica de Saúde do Dia */}
            <View style={styles.section}>
                <Text style={styles.title}>Dica de Saúde do Dia</Text>
                {dicaDoDia ? (
                    <TouchableOpacity onPress={() => navigation.navigate('Material de Apoio')}>
                        <Text style={styles.tipTitle}>{dicaDoDia.titulo}</Text>
                        <Text style={styles.tip}>{dicaDoDia.conteudo}</Text>
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
    tipTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 5,
    },
    questionarioItem: {
        backgroundColor: '#244a9c',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    questionarioTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noSurveys: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 14,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
});
