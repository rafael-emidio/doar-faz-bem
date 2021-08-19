const Solicitacao = require('../models/solicitacao')
const Sequelize = require('sequelize');


const sequelize = new Sequelize('doarfazbem', 'root', '', {
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

function verifyTipoDoacao(tipo_doacao) {
    let aux = []
    let flag = 1
    tipo_doacao = tipo_doacao.split(",")

    tipo_doacao.forEach(function (item, index) {
        //tira espaços e coloca tudo maiúsculo
        item = item.trim().toUpperCase()
        //tira o acento de remédio
        if (item.includes('É')) {
            item = item.replace('É', 'E')
        }

        //verifica se o item corresponde
        if (item == 'CESTA' ||
            item == 'REMEDIO' ||
            item == 'ROUPA') {
            aux.push(item)
        }
    })
    if (tipo_doacao.length != aux.length) {
        return false
    }
    return aux
}


module.exports = {
    async listar(req, res) {
        const solicitacoes = await Solicitacao.findAll()

        if (solicitacoes.length == 0)
            return erro(req, res, "Não existem solicitacao cadastrados");

        return res.status(200).json(solicitacoes)
    },

    async solicitacoesDoUsuario(req, res) {
        const { id } = req.params;
        const solicitacoes = await sequelize.query("SELECT * FROM solicitacao WHERE receptorId = " + id + ";", { type: sequelize.QueryTypes.SELECT });

        if (solicitacoes.length == 0)
            return erro(req, res, "Não existem solicitacoes para esse usuario");

        return res.status(200).json(solicitacoes)
    },

    async editar(req, res) {
        //const {id} = req.params;
        const { id } = req.body
        let { tipo_doacao, data, status, receptorId, doacaoId } = req.body;
        const solicitacao = await Solicitacao.findByPk(id);

        if (solicitacao == null)
            return erro(req, res, "Não foi possível atualizar a solicitacao " + id + ", solicitacao não encontrada");

        if (data == '' || data == null)
            return erro(req, res, "Não foi possível atualizar a solicitacao: data nulo ou vazio");

        if (status == null)
            return erro(req, res, "Não foi possível atualizar a solicitacao: status nulo ou vazio");

        if (receptorId == '' || receptorId == null)
            return erro(req, res, "Não foi possível atualizar a solicitacao: receptorId nulo ou vazio");

        if (tipo_doacao == '' || tipo_doacao == null)
            return erro(req, res, "Não foi possível atualizar a solicitacao: tipo_doacao nulo ou vazio");

        if (doacaoId == null)
            return erro(req, res, "Não foi possível atualizar a solicitacao: doacaoId nulo ou vazio");

        tipo_doacao = verifyTipoDoacao(tipo_doacao)
        if (tipo_doacao == false)
            return erro(req, res, "Não foi possível atualizar a solicitacao: tipo_doacao deve seguir o formato especificado (CESTA, REMEDIO, ROUPA)");

        tipo_doacao = tipo_doacao.join()

        solicitacao.tipo_doacao = tipo_doacao
        solicitacao.data = data
        solicitacao.status = status
        solicitacao.receptorId = receptorId
        solicitacao.doacaoId = doacaoId

        const solicitacao_response = await solicitacao.save()
        return res.status(200).json(solicitacao_response)
    },

    async cadastrar(req, res) {
        let { tipo_doacao, data, status, receptorId, doacaoId } = req.body;

        if (data == '' || data == null)
            return erro(req, res, "Não foi possível cadastrar a solicitacao: data nulo ou vazio");

        if (status == null)
            return erro(req, res, "Não foi possível cadastrar a solicitacao: status nulo ou vazio");

        if (receptorId == '' || receptorId == null)
            return erro(req, res, "Não foi possível cadastrar a solicitacao: receptorId nulo ou vazio");

        if (tipo_doacao == '' || tipo_doacao == null)
            return erro(req, res, "Não foi possível cadastrar a solicitacao: tipo_doacao nulo ou vazio");

        //tipo_doacao = verifyTipoDoacao(tipo_doacao)
        if (tipo_doacao != 'CESTA' && tipo_doacao != 'REMEDIO' && tipo_doacao != 'ROUPA')
            return erro(req, res, "Não foi possível cadastrar o usuário: tipo_doacao deve seguir o formato especificado (CESTA, REMEDIO, ROUPA)");

        if (doacaoId == null)
            return erro(req, res, "Não foi possível atualizar a solicitacao: doacaoId nulo ou vazio");

        const solicitacao = await Solicitacao.create({ tipo_doacao, data, status, receptorId, doacaoId })

        return res.status(200).json(solicitacao)
    },

    async excluir(req, res) {
        const { id } = req.params
        const solicitacao = await Solicitacao.findByPk(id)

        if (solicitacao == null)
            return erro(req, res, "Não foi possível excluir a docao" + id + ", solicitacao não encontrada");

        solicitacao.destroy()
        return res.status(200).json(solicitacao)
    },

    async listarEspecifico(req, res) {
        const { id } = req.params
        const solicitacao = await Solicitacao.findByPk(id)

        if (solicitacao == null)
            return erro(req, res, "Não foi possível recuperar os dados da solicitacao " + id + ", solicitacao não encontrada");

        return res.status(200).json(solicitacao)
    },


}

