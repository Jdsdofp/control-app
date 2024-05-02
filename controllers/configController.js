const Loja = require('../models/loja'); // Importe o modelo da filial
const Time = require('../models/Time');

// Função para cadastrar um novo time
exports.cadastrarTime = async (req, res) => {
    try {
        // Extrair os dados do corpo da requisição
        const { nomeTime, descricaoTime } = req.body;

        // Verificar se o nome do time já existe no banco de dados
        const existingTime = await Time.findOne({ nomeTime });
        if (existingTime) {
            return res.status(400).json({ error: 'Este nome de time já está em uso.' });
        }

        // Criar uma nova instância do modelo Time
        const novoTime = new Time({
            nomeTime,
            descricaoTime
        });

        // Salvar o novo time no banco de dados
        await novoTime.save();

        // Retornar uma resposta de sucesso
        return res.status(200).json({ message: 'Time cadastrado com sucesso.' });
    } catch (error) {
        console.error(error);
        // Retornar uma resposta de erro em caso de falha
        return res.status(500).json({ error: 'Ocorreu um erro ao cadastrar o time.' });
    }
};


// Controlador para cadastrar uma nova filial
exports.cadastrarFilial = async (req, res) => {
    try {
        const { nrLoja, nomeLoja, enderecoLoja, cidadeLoja, ufLoja, latLoja, lonLoja } = req.body;

        // Verifica se todos os campos obrigatórios estão preenchidos
        if (!nrLoja || !nomeLoja || !enderecoLoja || !cidadeLoja || !ufLoja || !latLoja || !lonLoja) {
            return res.status(400).json({ error: 'Por favor, preencha todos os campos.' });
        }

        // Verifica se a loja já está cadastrada com o mesmo número ou nome
        const existingLoja = await Loja.findOne({ $or: [{ nrLoja }, { nomeLoja }] });
        if (existingLoja) {
            return res.status(400).json({ error: 'Esta loja já está cadastrada.' });
        }

        // Cria uma nova instância do modelo de filial com os dados recebidos
        const novaFilial = new Loja({
            nrLoja,
            nomeLoja,
            enderecoLoja,
            cidadeLoja,
            ufLoja,
            latLoja,
            lonLoja
        });

        // Salva a nova filial no banco de dados
        await novaFilial.save();

        // Retorna uma resposta de sucesso
        return res.status(201).json({ message: 'Filial cadastrada com sucesso.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Ocorreu um erro ao cadastrar a filial. Por favor, tente novamente mais tarde.' });
    }
};
