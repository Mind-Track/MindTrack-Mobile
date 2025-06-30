import api from './api'; 
import { Alert } from 'react-native';

export const submitCheckIn = async (data) => {
  try {
    const response = await api.post('/checkin/novo', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar check-in:', error.response?.data || error.message);
    Alert.alert('Erro', 'Não foi possível enviar o check-in.');
    throw error;
  }
};

export const fetchCheckins = async (userId) => {
  if (!userId) {
    throw new Error("ID do usuário não fornecido para buscar histórico.");
  }
  try {
    const response = await api.get(`/checkin/historico/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar check-ins:", error.message);
    throw error;
  }
};
