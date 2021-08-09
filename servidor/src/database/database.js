const Squelize = require('sequelize');

const Usuario = require('../models/usuario')

const connection = new Squelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'historias',
    define: {
        timestamps: false,
    },

});

Usuario.init(connection)

module.exports = connection;