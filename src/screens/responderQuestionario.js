import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';

// Simulação de serviço
import { buscarQuestionarioPorId, enviarRespostas } from '../services/questionarioService';

export default function ResponderQuestionario() {
  const route = useRoute();
  const navigation = useNavigation();

  // Extrai id com segurança (evita erro se params for undefined)
  const id = route.params?.id;

  const [questionario, setQuestionario] = useState(null);
  const [respostas, setRespostas] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      Alert.alert('Erro', 'ID do questionário não informado');
      navigation.goBack();
      return;
    }

    buscarQuestionarioPorId(id)
      .then(data => {
        const perguntas = data.description.split(';').map((texto, index) => ({
          id: index + 1,
          texto: texto.trim()
        }));

        setQuestionario({ ...data, perguntas });

        // Inicializa respostas com zero (não respondido)
        const respostasIniciais = {};
        perguntas.forEach(p => {
          respostasIniciais[p.id] = 0;
        });
        setRespostas(respostasIniciais);

        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Erro', 'Erro ao carregar questionário');
        navigation.goBack();
      });
  }, [id]);

  const selecionarResposta = (perguntaId, valor) => {
    setRespostas(prev => ({ ...prev, [perguntaId]: valor }));
  };

  const formInvalido = () => {
    return Object.values(respostas).some(val => val === 0);
  };

  const handleEnviar = async () => {
    if (!questionario) return;

    const respostasFormatadas = Object.entries(respostas).map(([perguntaId, resposta]) => ({
      perguntaId: Number(perguntaId),
      resposta
    }));

    try {
      // Aqui o funcId está fixo (9), ajustar conforme sua autenticação
      await enviarRespostas(questionario.id, 9, respostasFormatadas);
      Alert.alert('Sucesso', 'Respostas enviadas com sucesso');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Erro ao enviar respostas');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#366AEE" style={{ marginTop: 100 }} />;
  }

  if (!questionario) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Questionário não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>{questionario.title}</Text>
      </View>

      <Text style={styles.prazo}>Prazo: {format(new Date(questionario.dueDate), 'dd/MM/yyyy')}</Text>

      {questionario.perguntas.map((pergunta, i) => (
        <View key={pergunta.id} style={styles.perguntaBox}>
          <Text style={styles.pergunta}>{i + 1}. {pergunta.texto}</Text>
          <View style={styles.opcoes}>
            {[1, 2, 3, 4, 5].map(val => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.opcao,
                  respostas[pergunta.id] === val && styles.selecionado
                ]}
                onPress={() => selecionarResposta(pergunta.id, val)}
              >
                <Text style={[
                  styles.opcaoTexto,
                  respostas[pergunta.id] === val && styles.selecionadoTexto
                ]}>
                  {val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.botaoEnviar, formInvalido() && styles.botaoDesabilitado]}
        onPress={handleEnviar}
        disabled={formInvalido()}
      >
        <Text style={styles.botaoTexto}>Enviar Respostas</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#89CFF0',
    padding: 20,
    minHeight: '100%',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    backgroundColor: '#366AEE',
    color: 'white',
    padding: 15,
    borderRadius: 15,
    fontSize: 20,
    fontWeight: 'bold',
  },
  prazo: {
    fontSize: 16,
    marginBottom: 20,
    color: '#162B61',
    fontWeight: 'bold',
  },
  perguntaBox: {
    marginBottom: 25,
  },
  pergunta: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#162B61',
  },
  opcoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  opcao: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  opcaoTexto: {
    fontSize: 18,
    color: '#fff',
  },
  selecionado: {
    backgroundColor: '#fff',
  },
  selecionadoTexto: {
    color: '#366AEE',
  },
  botaoEnviar: {
    backgroundColor: '#366AEE',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  botaoDesabilitado: {
    backgroundColor: '#7a9ae0',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
