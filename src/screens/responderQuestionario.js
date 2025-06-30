import React, { useState, useEffect, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    TextInput
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { buscarQuestionarioPorId, enviarRespostas } from '../services/questionarioService';
import { Ionicons } from '@expo/vector-icons';

// --- Sub-componentes para cada tipo de pergunta ---
const OpcaoUnica = ({ pergunta, respostas, onSelect }) => {
    const respostaAtual = respostas.find(r => r.perguntaId === pergunta.id);
    return (
        <View style={styles.opcoesContainer}>
            {pergunta.opcoes.map(opcao => (
                <TouchableOpacity
                    key={opcao.id}
                    style={[styles.opcaoBotao, respostaAtual?.opcaoId === opcao.id && styles.opcaoSelecionada]}
                    onPress={() => onSelect(pergunta.id, opcao.id)}
                >
                    <Text style={[styles.opcaoTexto, respostaAtual?.opcaoId === opcao.id && styles.opcaoTextoSelecionado]}>
                        {opcao.textoOpcao}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const OpcaoMultipla = ({ pergunta, respostas, onSelect }) => {
    const respostasAtuais = respostas.filter(r => r.perguntaId === pergunta.id).map(r => r.opcaoId);
    return (
        <View>
            {pergunta.opcoes.map(opcao => {
                const isSelected = respostasAtuais.includes(opcao.id);
                return (
                    <TouchableOpacity
                        key={opcao.id}
                        style={styles.checkboxContainer}
                        onPress={() => onSelect(pergunta.id, opcao.id)}
                    >
                        <Ionicons name={isSelected ? 'checkbox' : 'square-outline'} size={24} color="#fff" />
                        <Text style={styles.checkboxLabel}>{opcao.textoOpcao}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const OpcaoAberta = ({ pergunta, respostas, onUpdate }) => {
    const respostaAtual = respostas.find(r => r.perguntaId === pergunta.id)?.texto || '';
    return (
        <View>
            <TextInput
                style={styles.respostaAberta}
                multiline
                placeholder="Digite sua resposta aqui..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={respostaAtual}
                onChangeText={(text) => onUpdate(pergunta.id, text)}
                maxLength={120}
            />
            <Text style={styles.contadorCaracteres}>{respostaAtual.length} / 120</Text>
        </View>
    );
};

// --- Componente Principal ---
export default function ResponderQuestionarioScreen() {
    const { user } = useAuth();
    const navigation = useNavigation();
    const route = useRoute();

    const [questionario, setQuestionario] = useState(null);
    const [respostas, setRespostas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const questionarioId = route.params?.questionarioId;
        if (questionarioId) {
            const carregarDados = async () => {
                try {
                    const data = await buscarQuestionarioPorId(questionarioId);
                    setQuestionario(data);
                    const respostasIniciais = data.perguntas
                        .filter(p => p.tipo !== 'MULTIPLA_ESCOLHA')
                        .map(p => ({ perguntaId: p.id, opcaoId: null, texto: null }));
                    setRespostas(respostasIniciais);
                } catch (error) {
                    Alert.alert("Erro", "Não foi possível carregar o questionário.", [{ text: "OK", onPress: () => navigation.goBack() }]);
                } finally {
                    setLoading(false);
                }
            };
            carregarDados();
        }
    }, [route.params?.questionarioId]);

    const selecionarOpcaoUnica = (perguntaId, opcaoId) => {
        setRespostas(prev => {
            const outrasRespostas = prev.filter(r => r.perguntaId !== perguntaId);
            return [...outrasRespostas, { perguntaId, opcaoId, texto: null }];
        });
    };

    const selecionarOpcaoMultipla = (perguntaId, opcaoId) => {
        setRespostas(prev => {
            const jaExiste = prev.find(r => r.perguntaId === perguntaId && r.opcaoId === opcaoId);
            if (jaExiste) {
                return prev.filter(r => r.opcaoId !== opcaoId || r.perguntaId !== perguntaId);
            } else {
                return [...prev, { perguntaId, opcaoId, texto: null }];
            }
        });
    };

    const atualizarRespostaAberta = (perguntaId, texto) => {
        setRespostas(prev => {
            const outrasRespostas = prev.filter(r => r.perguntaId !== perguntaId);
            return [...outrasRespostas, { perguntaId, opcaoId: null, texto }];
        });
    };

    const renderPergunta = (pergunta) => {
        switch (pergunta.tipo) {
            case 'LIKERT':
            case 'SIM/NÃO':
                return <OpcaoUnica pergunta={pergunta} respostas={respostas} onSelect={selecionarOpcaoUnica} />;
            case 'MULTIPLA_ESCOLHA':
                return <OpcaoMultipla pergunta={pergunta} respostas={respostas} onSelect={selecionarOpcaoMultipla} />;
            case 'ABERTA':
                return <OpcaoAberta pergunta={pergunta} respostas={respostas} onUpdate={atualizarRespostaAberta} />;
            default:
                return <Text style={{ color: 'red' }}>Tipo de pergunta não suportado: {pergunta.tipo}</Text>;
        }
    };

    const isFormInvalido = useMemo(() => {
        if (!questionario || !questionario.perguntas) return true;
        const totalPerguntas = questionario.perguntas.length;
        const perguntasRespondidas = new Set(
            respostas
                .filter(r => r.opcaoId !== null || (r.texto && r.texto.trim() !== ''))
                .map(r => r.perguntaId)
        );
        return perguntasRespondidas.size < totalPerguntas;
    }, [questionario, respostas]);

    const handleEnviarRespostas = async () => {
        if (isFormInvalido) {
            Alert.alert("Atenção", "Por favor, responda todas as perguntas antes de enviar.");
            return;
        }
        setLoading(true);
        try {
            await enviarRespostas(questionario.id, user.id, respostas);
            Alert.alert("Sucesso!", "Questionário enviado com sucesso.", [{ text: "OK", onPress: () => navigation.goBack() }]);
        } catch (error) {
            Alert.alert("Erro", "Houve um problema ao enviar suas respostas.");
        } finally {
            setLoading(false);
        }
    };

    if (loading || !questionario) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#366AEE" /></View>;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{questionario.titulo}</Text>
                <Text style={styles.description}>{questionario.descricao}</Text>
            </View>

            {questionario.perguntas.map((pergunta, index) => (
                <View key={pergunta.id} style={styles.perguntaBox}>
                    <Text style={styles.perguntaTexto}>{index + 1}. {pergunta.texto}</Text>
                    {renderPergunta(pergunta)}
                </View>
            ))}

            <TouchableOpacity
                style={[styles.btnEnviar, isFormInvalido && styles.btnDesabilitado]}
                onPress={handleEnviarRespostas}
                disabled={isFormInvalido}
            >
                <Text style={styles.btnEnviarTexto}>Enviar Respostas</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

// --- Estilos ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#89CFF0' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#89CFF0' },
    header: { padding: 20, backgroundColor: '#162B61', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginBottom: 10 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10 },
    description: { fontSize: 16, color: '#ddd', textAlign: 'center' },
    perguntaBox: { backgroundColor: '#366AEE', margin: 20, padding: 20, borderRadius: 15 },
    perguntaTexto: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
    opcoesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
    opcaoBotao: { borderWidth: 2, borderColor: '#fff', backgroundColor: 'transparent', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 15, minWidth: 80, alignItems: 'center' },
    opcaoSelecionada: { backgroundColor: '#fff' },
    opcaoTexto: { color: '#fff', fontWeight: 'bold' },
    opcaoTextoSelecionado: { color: '#366AEE' },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
    checkboxLabel: { color: '#fff', fontSize: 16, marginLeft: 10 },
    respostaAberta: { backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff', padding: 10, borderRadius: 5, minHeight: 80, textAlignVertical: 'top' },
    contadorCaracteres: { color: '#eee', textAlign: 'right', fontSize: 12, marginTop: 4 },
    btnEnviar: { backgroundColor: '#162B61', padding: 15, margin: 20, borderRadius: 15, alignItems: 'center' },
    btnDesabilitado: { backgroundColor: '#A0A0A0' },
    btnEnviarTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
