import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert } from 'react-native';

import { useAuth } from '../contexts/AuthContext'; 
import { fetchCheckins } from '../services/checkinService';

const humorEmojis = {
  "1": "😡",
  "2": "😔",
  "3": "😐",
  "4": "🙂",
  "5": "😁",
};

const formatarData = (dataISO) => {
  if (!dataISO) return 'Data inválida'; 
  const data = new Date(dataISO);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

export default function Historico({ navigation }) {
  const { user } = useAuth();

  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregaCheckins = async () => {
      if (user && user.id) {
        try {
          setLoading(true); 
          setError(null);   

          const data = await fetchCheckins(user.id);
          setCheckins(data);
        } catch (err) {
          setError(err.message || "Erro ao carregar dados da API");
          Alert.alert("Erro", "Não foi possível carregar o histórico.");
        } finally {
          setLoading(false);
        }
      } else {
        setCheckins([]); 
        setLoading(false);
      }
    };

    carregaCheckins();
  }, [user]); 

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.dateText}>{formatarData(item.dataHora)}</Text>
      <Text style={styles.commentText}>{item.comentario || "Sem comentário"}</Text>
      <Text style={styles.emoji}>{humorEmojis[item.nivelHumor?.toString()] || "❓"}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Histórico de {user ? user.name : ''}</Text>

      {loading && <ActivityIndicator size="large" color="#3E2F5B" />}

      {error && !loading && <Text style={styles.errorText}>{error}</Text>}

      {!loading && !error && checkins.length > 0 && (
        <FlatList
          data={checkins}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={true}
        />
      )}
      
      {!loading && !error && checkins.length === 0 && (
        <Text style={styles.emptyText}>Nenhum check-in encontrado.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#89CFF0',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#000",
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#3E2F5B",
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    elevation: 3,
  },
  dateText: {
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#FFF",
    flex: 1.5,
    textAlign: 'left',
  },
  commentText: {
    fontSize: 16, 
    color: "#FFF",
    flex: 3,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  emoji: {
    fontSize: 24,
    flex: 1,
    textAlign: 'right',
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#3E2F5B',
  }
});
