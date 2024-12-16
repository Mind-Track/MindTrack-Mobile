import api from './api'; 

export const submitCheckIn = async (data) => {
    try {
      console.log('Dados que estão sendo enviados para o backend:', data); // Verifique os dados aqui
      const response = await api.post('/checkin', data);
      return response.data;
    } catch (error) {
        console.error('Erro ao enviar check-in:', error);
        if (error.response) {
          // Caso haja uma resposta do erro do servidor
          console.error('Resposta do erro do servidor:', error.response.data);
          console.error('Status do erro do servidor:', error.response.status);
        }
        Alert.alert('Erro', 'Não foi possível enviar o check-in.');
      }
  };
  
