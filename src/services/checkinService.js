import api from './api';

export const submitCheckIn = async (data) => {
    try {
      const response = await axios.post('http://localhost:8080/checkin', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar o check-in:', error.response?.data || error.message);
      throw error;
    }
  };
