import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { listarQuestionariosPorFuncionario } from '../services/questionarioService';

const formatarData = (dataISO) => {
    if (!dataISO) return 'Sem prazo';
    const data = new Date(dataISO);
    data.setDate(data.getDate() + 1);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
};

export default function QuestionariosScreen() {
    const { user } = useAuth();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [questionarios, setQuestionarios] = useState([]);
    const [loading, setLoading] = useState(true);

    const carregarDados = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await listarQuestionariosPorFuncionario(user.id);

            const lista = Array.isArray(data) ? data : [];

            const questionariosComStatus = lista.map(q => ({
                ...q,
                respondido: false
            }));

            setQuestionarios(questionariosComStatus);
        } catch (error) {
            const mensagemErro = error?.response?.data?.message || error?.message || "";

            if (
                error?.response?.status === 404 &&
                mensagemErro.includes("Nenhum questionário disponível para o funcionário informado.")
            ) {
                setQuestionarios([]);
            } else {
                Alert.alert("Erro", "Não foi possível carregar os questionários.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            carregarDados();
        }
    }, [isFocused]);

    const renderItem = ({ item }) => {
        const respondido = item.respondido;

        return (
            <TouchableOpacity
                style={[
                    styles.itemContainer,
                    !respondido && styles.itemNaoRespondido
                ]}
                disabled={respondido}
                onPress={() => navigation.navigate('ResponderQuestionario', { questionarioId: item.id })}
            >
                <Text style={styles.itemTitle}>Tema: {item.titulo}</Text>
                <Text style={styles.itemDueDate}>Prazo: {formatarData(item.dataValidade)}</Text>

                {respondido ? (
                    <Text style={styles.statusTextRespondido}>Já respondido</Text>
                ) : (
                    <Text style={styles.statusTextResponder}>Clique aqui para responder</Text>
                )}
            </TouchableOpacity>
        );
    };

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#366AEE" /></View>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={questionarios}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={() => (
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>Parabéns! Você já respondeu todos os questionários disponíveis.</Text>
                    </View>
                )}
            />
        </View>
    );
}

// Estilos
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#89CFF0' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContainer: { padding: 20 },
    itemContainer: {
        backgroundColor: '#162B61',
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    itemNaoRespondido: {
        backgroundColor: '#366AEE',
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    itemDueDate: {
        fontSize: 15,
        color: '#DDDDDD',
        marginBottom: 15,
    },
    statusTextRespondido: {
        fontSize: 16,
        color: '#A0A0A0',
        fontWeight: 'bold',
        alignSelf: 'flex-end',
    },
    statusTextResponder: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        alignSelf: 'flex-end',
    },
    emptyText: {
        fontSize: 18,
        color: '#162B61',
    },
});
