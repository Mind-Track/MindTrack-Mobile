import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://192.168.18.62:8080', // para teste no celular sendo o ip do seu pc
  baseURL: 'http://localhost:8080', // para teste web
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
