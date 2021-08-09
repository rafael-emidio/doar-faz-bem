const Usuario = require('../models/usuario')
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');

const sequelize = new Sequelize('historias', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});


module.exports = {
    async listar(req, res) {
        const usuarios = await Usuario.findAll()
        return res.json(usuarios)
    },

    async editar(req, res) {
        //const {id} = req.params;
        const { id } = req.body
        const { nome, cpf, senha, email, telefone, endereco, tipo, tip_doacao } = req.body;
        const usuario = await Usuario.findByPk(id);

        usuario.nome = nome
        usuario.cpf = cpf
        usuario.senha = senha
        usuario.email = email
        usuario.telefone = telefone
        usuario.endereco = endereco
        usuario.tipo = tipo
        usuario.tip_doacao = tip_doacao

        const usuario_response = await usuario.save()
        return res.json(usuario_response)
    },

    async cadastrar(req, res) {
        const { nome, cpf, senha, email, telefone, endereco, tipo, tip_doacao } = req.body;
        const usuario = await Usuario.create({ nome, cpf, senha, email, telefone, endereco, tipo, tip_doacao })
        return res.json(usuario)
    },

    async excluir(req, res) {
        const { id } = req.params
        const usuario = await Usuario.findByPk(id)
        usuario.destroy()

        return res.json(usuario)
    },

    async listarEspecifico(req, res) {
        const { id } = req.params
        const usuario = await Usuario.findByPk(id)
        return res.status(200).json(usuario)
    },

    async login(req, res) {
        const { cpf, senha } = req.body
        const usuario = await sequelize.query("SELECT * FROM usuario WHERE cpf = '" + cpf + "' AND senha = '" + senha + "';");
        // if(usuario){
        //     let token = jwt.sign({

        //     })
        // }
        return res.json(usuario)
    },

}
