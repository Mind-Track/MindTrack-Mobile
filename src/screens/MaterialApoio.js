import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Modal,
    ScrollView,
    ActivityIndicator,
    Alert,
    Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { listarMateriais, downloadArquivo } from '../services/materiaisService';

export default function MaterialApoioScreen() {
    const [dicas, setDicas] = useState([]);
    const [dicaSelecionada, setDicaSelecionada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const dados = await listarMateriais();
                setDicas(dados);
            } catch (error) {
                Alert.alert("Erro", "Não foi possível carregar os materiais de apoio.");
            } finally {
                setLoading(false);
            }
        };
        carregarDados();
    }, []);

    const handleOpenLink = async (url) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert('Erro', `Não é possível abrir esta URL: ${url}`);
        }
    };

    const handleDownloadPdf = async (fileName) => {
        if (downloading || !fileName) return;
        setDownloading(true);
        try {
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;
            const fileInfo = await FileSystem.getInfoAsync(fileUri);

            if (!fileInfo.exists) {
                console.log("Arquivo não existe localmente. Baixando...");
                const blob = await downloadArquivo(fileName);

                const reader = new FileReader();
                reader.readAsDataURL(blob);

                reader.onloadend = async () => {
                    const base64data = reader.result.split(',')[1];
                    await FileSystem.writeAsStringAsync(fileUri, base64data, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    await Sharing.shareAsync(fileUri);
                };
            } else {
                console.log("Arquivo já existe. Compartilhando...");
                await Sharing.shareAsync(fileUri);
            }
        } catch (error) {
            Alert.alert("Erro de Download", "Não foi possível baixar ou abrir o arquivo.");
        } finally {
            setDownloading(false);
        }
    };

    const renderDicaCard = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => setDicaSelecionada(item)}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            {item.conteudo && (
                <Text style={styles.cardSnippet}>
                    {item.conteudo.substring(0, 100)}...
                </Text>
            )}
        </TouchableOpacity>
    );

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#366AEE" /></View>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={dicas}
                renderItem={renderDicaCard}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={!!dicaSelecionada}
                onRequestClose={() => setDicaSelecionada(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setDicaSelecionada(null)}>
                            <Ionicons name="close-circle" size={30} color="#fff" />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>{dicaSelecionada?.titulo}</Text>
                        <ScrollView style={styles.modalScrollView}>
                            <Text style={styles.modalText}>{dicaSelecionada?.conteudo}</Text>
                        </ScrollView>

                        {dicaSelecionada?.links?.map((link, index) => (
                            <TouchableOpacity key={index} style={styles.linkButton} onPress={() => handleOpenLink(link)}>
                                <Ionicons name="link" size={20} color="#89CFF0" />
                                <Text style={styles.linkButtonText}>Acessar mais informações</Text>
                            </TouchableOpacity>
                        ))}

                        {dicaSelecionada?.nomeArquivo && (
                            <TouchableOpacity style={styles.linkButton} onPress={() => handleDownloadPdf(dicaSelecionada.nomeArquivo)} disabled={downloading}>
                                {downloading ? (
                                    <ActivityIndicator color="#89CFF0" />
                                ) : (
                                    <>
                                        <Ionicons name="document-attach" size={20} color="#89CFF0" />
                                        <Text style={styles.linkButtonText}>Baixar PDF</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#89CFF0' },
    container: { flex: 1, backgroundColor: '#89CFF0' },
    listContainer: { padding: 10 },
    card: {
        flex: 1,
        margin: 10,
        backgroundColor: '#366AEE',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        minHeight: 180,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
    },
    cardSnippet: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: '#162B61',
        borderRadius: 20,
        padding: 20,
        paddingTop: 40,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 15,
    },
    modalScrollView: {
        maxHeight: '50%',
        marginBottom: 20,
    },
    modalText: {
        fontSize: 16,
        color: 'white',
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#366AEE',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
    },
    linkButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 10,
    },
});
