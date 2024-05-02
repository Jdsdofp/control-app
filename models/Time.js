const mongoose = require('mongoose');

// Definindo o esquema para o modelo de Time
const timeSchema = new mongoose.Schema({
    nomeTime: {
        type: String,
        required: true
    },
    descricaoTime: {
        type: String
    }
});

// Criando o modelo de Time com base no esquema definido
const Time = mongoose.model('Time', timeSchema);

// Exportando o modelo de Time para uso em outras partes do código
module.exports = Time;
