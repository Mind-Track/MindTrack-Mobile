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
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

export default function RecuperarSenhaScreen() {
    const navigation = useNavigation();
    const { enviaEmailResetSenha } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        let timer;
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, []);

    const handleResetRequest = async () => {
        if (!email) {
            setError('Por favor, digite seu e-mail.');
            return;
        }

        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await enviaEmailResetSenha(email);
            setMessage(response.data || 'Link de recuperação enviado com sucesso!'); 
            Alert.alert('Sucesso', 'Verifique seu e-mail para o link de recuperação.');
            setEmail('');

            const timer = setTimeout(() => {
                navigation.navigate('Login');
            }, 4000);

        } catch (err) {
            setError(err.response?.data?.message || 'E-mail não cadastrado ou falha ao enviar.');
            Alert.alert('Erro', 'Não foi possível processar sua solicitação. Verifique o e-mail digitado.');
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
                    <Text style={styles.title}>Recuperar Senha</Text>
                    <Text style={styles.infoText}>
                        Digite seu e-mail abaixo e enviaremos um link para você cadastrar uma nova senha.
                    </Text>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    {message ? <Text style={styles.successText}>{message}</Text> : null}

                    <TextInput
                        style={styles.input}
                        placeholder="Seu e-mail cadastrado"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading && !message} 
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleResetRequest}
                        disabled={loading || !!message} 
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Enviar Link</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
                        <Text style={styles.linkText}>Voltar para o Login</Text>
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
    linkText: {
        marginTop: 20,
        fontSize: 14,
        color: '#FFFFFF', 
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