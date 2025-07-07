import axios from 'axios';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

const api = axios.create({
  baseURL: isWeb ? 'http://localhost:8080' : 'http://192.168.18.62:8080',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Mobile-Dev': 'true'
  },
});

api.interceptors.request.use(config => {
  console.log('Enviando requisição com a seguinte configuração:', JSON.stringify(config, null, 2));
  return config;
});

export default api;
