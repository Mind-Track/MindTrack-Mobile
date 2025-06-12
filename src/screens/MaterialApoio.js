import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Linking,
  Pressable,
} from 'react-native';

const dicasDeSaude = [
  {
    id: '1',
    title: 'Importância da Hidratação',
    content: 'Beber água regularmente ajuda na digestão, circulação e regulação da temperatura.',
    links: ['https://example.com/hidratacao'],
    fileName: 'hidratacao.pdf',
  },
  {
    id: '2',
    title: 'Alimentação Saudável',
    content: 'Evite alimentos ultraprocessados e prefira frutas, legumes e grãos integrais.',
    links: ['https://example.com/alimentacao'],
    fileName: 'alimentacao.pdf',
  },
  {
    id: '3',
    title: 'Atividade Física Regular',
    content: 'Exercícios ajudam a controlar o peso, melhorar o humor e prevenir doenças.',
    links: [],
    fileName: null,
  },
];

export default function MaterialApoio() {
  const [dicaSelecionada, setDicaSelecionada] = useState(null);

  const abrirLink = (url) => {
    Linking.openURL(url);
  };

  const downloadPDF = (fileName) => {
    alert(`Simulação de download do arquivo: ${fileName}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Material de Apoio</Text>

      <FlatList
        data={dicasDeSaude}
        numColumns={1}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setDicaSelecionada(item)}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardContent}>{item.content.slice(0, 100)}...</Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={!!dicaSelecionada} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable style={styles.close} onPress={() => setDicaSelecionada(null)}>
              <Text style={{ fontSize: 24, color: 'white' }}>×</Text>
            </Pressable>
            {dicaSelecionada && (
              <>
                <Text style={styles.modalTitle}>{dicaSelecionada.title}</Text>
                <Text style={styles.modalText}>{dicaSelecionada.content}</Text>

                {dicaSelecionada.links?.map((link, index) => (
                  <TouchableOpacity key={index} onPress={() => abrirLink(link)}>
                    <Text style={styles.link}>🔗 Acesse mais informações</Text>
                  </TouchableOpacity>
                ))}

                {dicaSelecionada.fileName && (
                  <TouchableOpacity onPress={() => downloadPDF(dicaSelecionada.fileName)}>
                    <Text style={styles.link}>📄 Baixar PDF</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#89CFF0',
    flex: 1,
    paddingTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor: '#366AEE',
    color: 'white',
    textAlign: 'center',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  cardContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#366AEE',
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  cardContent: {
    color: 'white',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#162B61',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  modalTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  link: {
    color: '#89CFF0',
    fontWeight: 'bold',
    marginTop: 10,
  },
});
