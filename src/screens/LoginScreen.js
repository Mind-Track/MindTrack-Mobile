import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    TouchableOpacity, 
    Image, 
    ImageBackground,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../contexts/AuthContext';

// --- Componente da Tela de Login ---
export default function LoginScreen() {
    const navigation = useNavigation();
    const { login } = useAuth(); 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Por favor, preencha e-mail e senha.');
            return;
        }

        setError(''); 
        setLoading(true); 

        try {
            await login({ email, password });

        } catch (err) {
            setError('E-mail ou senha incorretos. Tente novamente.');
            Alert.alert('Falha no Login', 'E-mail ou senha incorretos. Tente novamente.');
            setPassword(''); 
        } finally {
            setLoading(false); 
        }
    };

    // --- (JSX) ---
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container} 
        >
            <Image 
                source={require('../assets/images/fundo.png')}
                style={styles.headerImage}
                resizeMode="cover" 
            />

            <View style={styles.overlay} />

            <View style={styles.loginBox}>
                <Image 
                    source={require('../assets/images/logo.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>Login</Text>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    
                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry 
                    />

                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={handleLogin}
                        disabled={loading} 
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Entrar</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('RecuperarSenha')}>
                        <Text style={styles.linkText}>Esqueceu a senha?</Text>
                    </TouchableOpacity>
                </View>
        </KeyboardAvoidingView>
    );
}


// --- Estilos ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#56DBB4', // 1. Cor de fundo principal
        alignItems: 'center',
    },
    headerImage: {
        width: '100%',
        height: '40%', // 2. A imagem ocupa 40% do topo da tela
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '40%', // O overlay cobre apenas a imagem
        backgroundColor: 'rgba(86, 219, 180, 0.5)', 
    },
    loginBox: {
        width: '90%',
        maxWidth: 400,
        padding: 30,
        backgroundColor: 'transparent', 
        elevation: 0, 
        shadowColor: 'transparent',
        alignItems: 'center',
        marginTop: -80, 
        zIndex: 1, 
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#FFF',
        backgroundColor: '#FFF'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    errorText: {
        color: '#d9534f', 
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        fontSize: 16,
    },
    button: {
        width: '100%',
        backgroundColor: '#499C53',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkText: {
        marginTop: 20,
        fontSize: 14,
        color: '#499C53',
        fontWeight: 'bold',
    },
});