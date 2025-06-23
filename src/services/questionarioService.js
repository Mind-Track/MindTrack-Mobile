import api from './api';

export const listarQuestionariosPorFuncionario = async (funcionarioId) => {
    if (!funcionarioId) {
        throw new Error("ID do funcionário não fornecido.");
    }
    try {
        const response = await api.get('/questionarios', { 
            params: { 
                funcId: funcionarioId 
            } 
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar questionários:", error.response?.data || error.message);
        throw error;
    }
};

export const enviarRespostas = async (surveyId, funcId, respostas) => {
    try {
        const response = await api.post('/questionario/resposta', respostas, {
            params: { surveyId, funcId }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao enviar respostas:", error.response?.data || error.message);
        throw error;
    }
};

export const buscarQuestionarioPorId = async (questionarioId) => {
    try {
        const response = await api.get(`/questionario/${questionarioId}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar questionário ${questionarioId}:`, error.response?.data || error.message);
        throw error;
    }
};