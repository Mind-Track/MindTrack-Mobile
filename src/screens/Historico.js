import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, ActivityIndicator } from 'react-native';
import { fetchCheckins } from '../services/checkinService';
// Mapear os emojis com base no nível de humor
const humorEmojis = {
  "1": "😡", // Muito Ruim
  "2": "😔", // Ruim
  "3": "😐", // Regular
  "4": "🙂", // Bom
  "5": "😁", // Excelente
};

// Função para formatar a data no formato dd/MM/yyyy
const formatarData = (dataISO) => {
  const data = new Date(dataISO);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

export default function Historico({ navigation }) {
  const [checkins, setCheckins] = useState([]); // Estado para armazenar os dados
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState(null); // Estado para lidar com erros

  useEffect(() => {
    const carregaCheckins = async () =>{
      try{
        const data = await fetchCheckins();
        setCheckins(data);
      }catch (error){
        setError("Erro ao carregar dados da API");
      }finally{
        setLoading(false);
      }
    };
    carregaCheckins();
  }, []);

  // Renderiza cada item da lista
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {/* Data formatada */}
      <Text style={styles.dateText}>{formatarData(item.checkInData)}</Text>
      
      {/* Comentário */}
      <Text style={styles.commentText}>{item.comentario}</Text>
      
      {/* Emoji correspondente ao nível de humor */}
      <Text style={styles.emoji}>{humorEmojis[item.nivelHumor]}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Histórico</Text>

      {/* Indicador de carregamento */}
      {loading && (
        <ActivityIndicator size="large" color="#3E2F5B" />
      )}

      {/* Erro ao carregar */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Lista de Check-ins */}
      {!loading && !error && (
        <FlatList
          data={checkins}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={true}
        />
      )}

      {/* Botão para navegar até o Dashboard */}
      <View style={styles.buttonContainer}>
        <Button
          title="Dashboard"
          onPress={() => navigation.navigate("Dashboard")}
          color="#3E2F5B"
        />
      </View>
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
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    padding: 10
  },
  commentText:{
    fontSize: 18,
    fontWeight: 200,
    color: "#FFF",
    padding: 10
  },
  emoji: {
    fontSize: 24,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});