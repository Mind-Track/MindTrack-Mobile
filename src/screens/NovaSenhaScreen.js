import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image, 
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

export default function NovaSenhaScreen() {
    const navigation = useNavigation();
    const route = useRoute(); 
    const { cadastraNovaSenha } = useAuth();
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const tokenFromParams = route.params?.token;
        if (tokenFromParams) {
            setToken(tokenFromParams);
        } else {
            Alert.alert(
                "Erro Crítico", 
                "Token de redefinição não encontrado. Por favor, use o link enviado para o seu e-mail.",
                [{ text: "OK", onPress: () => navigation.navigate('Login') }]
            );
        }
    }, [route.params]);

    useEffect(() => {
        let timer;
        return () => clearTimeout(timer);
    }, []);
    
    const handleCadastroSenha = async () => {
        if (!senha || !confirmaSenha) {
            return setError('Por favor, preencha e confirme a nova senha.');
        }
        if (senha !== confirmaSenha) {
            return setError('As senhas não coincidem.');
        }
        if (!token) {
            return setError('Token inválido. Tente novamente a partir do seu e-mail.');
        }

        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await cadastraNovaSenha(senha, token);
            setMessage(response.data || "Senha alterada com sucesso!");
            Alert.alert("Sucesso!", "Sua senha foi alterada. Você já pode fazer o login.");
            
            const timer = setTimeout(() => {
                navigation.navigate('Login');
            }, 4000);

        } catch (err) {
            setError(err.response?.data?.message || 'Token expirado ou inválido. Tente novamente.');
            Alert.alert("Erro", "Não foi possível alterar sua senha. O link pode ter expirado.");
        } finally {
            setLoading(false);
        }
    };

    // --- (JSX) ---
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/fundo.png')}
                style={StyleSheet.absoluteFill} 
                blurRadius={20} 
            />
            
            <View style={styles.overlay} />

            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <View style={styles.loginBox}>
                    <Text style={styles.title}>Cadastrar Nova Senha</Text>
                    <Text style={styles.infoText}>
                        Escolha uma nova senha para acessar sua conta.
                    </Text>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    {message ? <Text style={styles.successText}>{message}</Text> : null}

                    <TextInput
                        style={styles.input}
                        placeholder="Nova Senha"
                        placeholderTextColor="#999"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                        editable={!loading && !message}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirme a Nova Senha"
                        placeholderTextColor="#999"
                        value={confirmaSenha}
                        onChangeText={setConfirmaSenha}
                        secureTextEntry
                        editable={!loading && !message}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleCadastroSenha}
                        disabled={loading || !!message}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Cadastrar Senha</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(86, 219, 180, 0.5)', 
    },
    loginBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
        padding: 30,
        borderRadius: 10,
        alignItems: 'center',
        width: '90%',
        maxWidth: 400,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        borderWidth: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF', 
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10,
        marginBottom: 15,
        textAlign: 'center',
    },
    infoText: {
        fontSize: 15,
        color: '#FFFFFF', 
        textAlign: 'center',
        marginBottom: 20,
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
    errorText: {
        color: '#FFCCCC', 
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 5,
        borderRadius: 5,
    },
    successText: {
        color: '#CCFFCC', 
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 5,
        borderRadius: 5,
    }
});