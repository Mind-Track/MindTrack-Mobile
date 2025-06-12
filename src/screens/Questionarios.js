import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const questionariosMock = [
  { id: 1, title: 'Saúde Mental', dueDate: '2025-06-20', respondido: false },
  { id: 2, title: 'Postura no Trabalho', dueDate: '2025-06-18', respondido: true },
  { id: 3, title: 'Prevenção de Acidentes', dueDate: '2025-06-25', respondido: false },
];

export default function Questionarios() {
  const [questionarios] = useState(questionariosMock);
  const navigation = useNavigation();

  const responderQuestionario = (id) => {
    navigation.navigate('ResponderQuestionario', { id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Questionários</Text>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {questionarios.length === 0 ? (
          <Text style={styles.empty}>Nenhum questionário disponível no momento.</Text>
        ) : (
          questionarios.map((q) => (
            <View
              key={q.id}
              style={[
                styles.item,
                !q.respondido && styles.naoRespondidoContainer
              ]}
            >
              <Text style={styles.tema}>Tema: {q.title}</Text>
              <Text style={styles.prazo}>Prazo: {q.dueDate}</Text>

              {q.respondido ? (
                <Text style={styles.respondido}>Já respondido</Text>
              ) : (
                <Pressable onPress={() => responderQuestionario(q.id)}>
                  <Text style={styles.link}>Clique aqui para responder</Text>
                </Pressable>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#89CFF0',
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  title: {
    backgroundColor: '#366AEE',
    color: 'white',
    padding: 15,
    borderRadius: 15,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    gap: 15,
  },
  item: {
    backgroundColor: '#162B61',
    padding: 15,
    borderRadius: 10,
    color: 'white',
  },
  naoRespondidoContainer: {
    backgroundColor: '#366AEE',
  },
  tema: {
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  prazo: {
    color: 'white',
    marginBottom: 10,
  },
  link: {
    textDecorationLine: 'underline',
    color: 'white',
    fontWeight: 'bold',
  },
  respondido: {
    color: 'gray',
  },
  empty: {
    textAlign: 'center',
    color: '#333',
    marginTop: 50,
  },
});
