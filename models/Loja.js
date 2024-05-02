const mongoose = require('mongoose');

const lojaSchema = new mongoose.Schema({
    nrLoja: String,
    nomeLoja: String,
    enderecoLoja: String,
    cidadeLoja: String,
    ufLoja: String,
    latLoja: String,
    lonLoja: String
});

module.exports = mongoose.model('Loja', lojaSchema);
