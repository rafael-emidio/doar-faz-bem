const Squelize = require('sequelize');

const Usuario = require('../models/usuario')
const Doacao = require('../models/doacao')
const Solicitacao = require('../models/solicitacao')

const connection = new Squelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'doarfazbem',
    define: {
        timestamps: false,
    },

});

Usuario.init(connection)
Doacao.init(connection)
Solicitacao.init(connection)

module.exports = connection;