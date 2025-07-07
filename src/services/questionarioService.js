import api from './api';

export const listarQuestionariosPorFuncionario = async (funcionarioId) => {
    if (!funcionarioId) {
        console.warn("ID do funcionário não fornecido.");
        return [];
    }

    try {
        const response = await api.get('/questionarios', {
            params: { funcId: funcionarioId }
        });
        return response.data;
    } catch (error) {
        const mensagem = error.response?.data?.message || error.message || "Erro desconhecido";
        console.log("Erro ao buscar questionários:", mensagem);

        // Retorna lista vazia caso erro 404 (sem questionários)
        if (
            error.response?.status === 404 &&
            mensagem.includes("Nenhum questionário disponível")
        ) {
            return [];
        }

        // Para os demais erros, retorne null ou false para controle
        return null;
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