const Usuario = require('../models/usuario')
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');


const sequelize = new Sequelize('doar-faz-bem', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

function erro(req, res, msg) {
    return res.status(400).json({
        "codigo": '0',
        "mensagem": msg
    })
}


module.exports = {
    async listar(req, res) {
        const usuarios = await Usuario.findAll()

        if (usuarios.length == 0)
            return erro(req, res, "Não existem usuários cadastrados");

        return res.status(200).json(usuarios)
    },

    async editar(req, res) {
        //const {id} = req.params;
        const { id } = req.body
        let { nome, cpf, senha, email, telefone, endereco, tipo, tipo_doacao } = req.body;
        const usuario = await Usuario.findByPk(id);

        if (usuario == null)
            return erro(req, res, "Não foi possível atualizar o usuário"+id+", usuário não encontrado");

        if (nome == '' || nome == null)
            return erro(req, res, "Não foi possível atualizar o usuário: nome nulo ou vazio");

        if (cpf == '' || cpf == null)
            return erro(req, res, "Não foi possível atualizar o usuário: cpf nulo ou vazio");

        if (senha == '' || senha == null)
            return erro(req, res, "Não foi possível atualizar o usuário: senha nulo ou vazio");

        if (email == '' || email == null)
            return erro(req, res, "Não foi possível atualizar o usuário: email nulo ou vazio");

        if (telefone == '' || telefone == null)
            return erro(req, res, "Não foi possível atualizar o usuário: telefone nulo ou vazio");

        if (endereco == '' || endereco == null)
            return erro(req, res, "Não foi possível atualizar o usuário: endereco nulo ou vazio");

        if (tipo == null)
            return erro(req, res, "Não foi possível atualizar o usuário: tipo nulo ou vazio");

        if (tipo_doacao == '' || tipo_doacao == null)
            return erro(req, res, "Não foi possível atualizar o usuário: tipo_doacao nulo ou vazio");

        cpf = cpf.replace(/[\s.-]*/igm, '')
        telefone = telefone.replace(/[\s()-]*/igm, '')
        usuario.nome = nome
        usuario.cpf = cpf
        usuario.senha = senha
        usuario.email = email
        usuario.telefone = telefone
        usuario.endereco = endereco
        usuario.tipo = tipo
        usuario.tipo_doacao = tipo_doacao

        const usuario_response = await usuario.save()
        return res.status(200).json(usuario_response)
    },

    async cadastrar(req, res) {
        let { nome, cpf, senha, email, telefone, endereco, tipo, tipo_doacao } = req.body;

        if (nome == '' || nome == null)
            return erro(req, res, "Não foi possível cadastrar o usuário: nome nulo ou vazio");

        if (cpf == '' || cpf == null)
            return erro(req, res, "Não foi possível cadastrar o usuário: cpf nulo ou vazio");

        if (senha == '' || senha == null)
            return erro(req, res, "Não foi possível cadastrar o usuário: senha nulo ou vazio");

        if (email == '' || email == null)
            return erro(req, res, "Não foi possível cadastrar o usuário: email nulo ou vazio");

        if (telefone == '' || telefone == null)
            return erro(req, res, "Não foi possível cadastrar o usuário: telefone nulo ou vazio");

        if (endereco == '' || endereco == null)
            return erro(req, res, "Não foi possível cadastrar o usuário: endereco nulo ou vazio");

        if (tipo == null)
            return erro(req, res, "Não foi possível cadastrar o usuário: tipo nulo ou vazio");

        if (tipo_doacao == '' || tipo_doacao == null)
            return erro(req, res, "Não foi possível cadastrar o usuário: tipo_doacao nulo ou vazio");


        cpf = cpf.replace(/[\s.-]*/igm, '')
        telefone = telefone.replace(/[\s()-]*/igm, '')

        const usuario = await Usuario.create({ nome, cpf, senha, email, telefone, endereco, tipo, tipo_doacao })
        return res.status(200).json(usuario)
    },

    async excluir(req, res) {
        const { id } = req.params
        const usuario = await Usuario.findByPk(id)

        if (usuario == null)
            return erro(req, res, "Não foi possível excluir o usuário"+id+", usuário não encontrado");

        usuario.destroy()
        return res.status(200).json(usuario)
    },

    async listarEspecifico(req, res) {
        const { id } = req.params
        const usuario = await Usuario.findByPk(id)

        if (usuario == null)
            return erro(req, res, "Não foi possível recuperar os dados do usuário "+id+", usuário não encontrado");

        return res.status(200).json(usuario)
    },

    async login(req, res) {
        let { cpf, senha } = req.body
        cpf = cpf.replace(/[\s.-]*/igm, '')
        const usuario = await sequelize.query("SELECT * FROM usuario WHERE cpf = '" + cpf + "' AND senha = '" + senha + "';", { type: sequelize.QueryTypes.SELECT });
        let token = '';

        if (usuario.length == 0)
            return erro(req, res, "Falha ao autenticar");

        token = jwt.sign({ ...usuario['id'] }, 'segredo', {
            expiresIn: 86400 // expires in 1 day
        });

        return res.status(200).json({
            "token": token,
            "usuario": usuario[0]
        })
    },

    async logout(req, res) {
        return res.status(200).json({
            "codigo": 1,
            "mensagem": 'usuario deslogado.'
        })
    },



}

