import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedUser = await AsyncStorage.getItem('@Auth:user');
        const storedToken = await AsyncStorage.getItem('@Auth:token');

        if (storedUser && storedToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to load user data from storage", e);
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);


  async function login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      const user = response.data.user || response.data;
      const token = response.data.token;

      if (!user.role || !user.role.includes('FUNC')) {
        throw new Error('Acesso restrito. Apenas funcionários podem usar este aplicativo.');
      }

      setUser(user);

      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await AsyncStorage.setItem('@Auth:token', token);
      }

      await AsyncStorage.setItem('@Auth:user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Falha no login:', error.response?.data || error.message);
      throw error;
    }
  }

  async function logout() {
    try {
    } catch (error) {
      console.error("Erro no logout da API", error);
    } finally {
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      await AsyncStorage.removeItem('@Auth:user');
      await AsyncStorage.removeItem('@Auth:token');
    }
  }

  async function enviaEmailResetSenha(email) {
    return api.post('/esqueci-minha-senha', { email });
  }

  async function cadastraNovaSenha(senha, token) {
    return api.post('/cadastroSenha', { senha }, { params: { token } });
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, isLoading, login, logout, enviaEmailResetSenha, cadastraNovaSenha }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
