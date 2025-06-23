import api from './api';

export const listarMateriais = async () => {
    try {
        const response = await api.get('/materiais/listar');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar materiais de apoio:", error.response?.data || error.message);
        throw error;
    }
};

export const downloadArquivo = async (fileName) => {
    try {
        const response = await api.get(`/materiais/download/${fileName}`, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao fazer download do arquivo ${fileName}:`, error.response?.data || error.message);
        throw error;
    }
};