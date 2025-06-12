export const buscarQuestionarioPorId = async (id: number) => {
  return {
    id,
    title: 'Satisfação com o Transporte',
    dueDate: new Date().toISOString(),
    description: 'Como foi sua experiência?;O motorista foi cordial?;O carro estava limpo?;O trajeto foi eficiente?;Você recomendaria o serviço?'
  };
};

export const enviarRespostas = async (questionarioId: number, funcionarioId: number, respostas: any[]) => {
  console.log('Enviando respostas:', { questionarioId, funcionarioId, respostas });
  return Promise.resolve();
};
