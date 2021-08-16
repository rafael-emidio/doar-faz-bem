const Doacao = require('../models/doacao')
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
        const doacoes = await Doacao.findAll()

        if (doacoes.length == 0)
            return erro(req, res, "Não existem doacao cadastrados");

        return res.status(200).json(doacoes)
    },

    async editar(req, res) {
        //const {id} = req.params;
        const { id } = req.body
        let { tipo_doacao, data, local, doadorId, receptorId } = req.body;
        const doacao = await Doacao.findByPk(id);

        if (doacao == null)
            return erro(req, res, "Não foi possível atualizar a doacao" + id + ", doacao não encontrada");

        if (tipo_doacao == '' || tipo_doacao == null)
            return erro(req, res, "Não foi possível atualizar a doacao: tipo_doacao nulo ou vazio");

        if (data == '' || data == null)
            return erro(req, res, "Não foi possível atualizar a doacao: data nulo ou vazio");

        if (local == '' || local == null)
            return erro(req, res, "Não foi possível atualizar a doacao: local nulo ou vazio");

        if (doadorId == '' || doadorId == null)
            return erro(req, res, "Não foi possível atualizar a doacao: doadorId nulo ou vazio");

        if (receptorId == '' || receptorId == null)
            return erro(req, res, "Não foi possível atualizar a doacao: receptorId nulo ou vazio");

        doacao.tipo_doacao = tipo_doacao
        doacao.data = data
        doacao.local = local
        doacao.doadorId = doadorId
        doacao.receptorId = receptorId

        const doacao_response = await doacao.save()
        return res.status(200).json(doacao_response)
    },

    async cadastrar(req, res) {
        let { tipo_doacao, data, local, doadorId, receptorId } = req.body;

        if (doacao == null)
            return erro(req, res, "Não foi possível cadastrar a doacao" + id + ", doacao não encontrada");

        if (tipo_doacao == '' || tipo_doacao == null)
            return erro(req, res, "Não foi possível cadastrar a doacao: tipo_doacao nulo ou vazio");

        if (data == '' || data == null)
            return erro(req, res, "Não foi possível cadastrar a doacao: data nulo ou vazio");

        if (local == '' || local == null)
            return erro(req, res, "Não foi possível cadastrar a doacao: local nulo ou vazio");

        if (doadorId == '' || doadorId == null)
            return erro(req, res, "Não foi possível cadastrar a doacao: doadorId nulo ou vazio");

        if (receptorId == '' || receptorId == null)
            return erro(req, res, "Não foi possível cadastrar a doacao: receptorId nulo ou vazio");

        // tipo_doacao = verifyTipoDoacao(tipo_doacao)
        // if (tipo_doacao == false)
        //     return erro(req, res, "Não foi possível cadastrar o usuário: tipo_doacao deve seguir o formato especificado (CESTA, REMEDIO, ROUPA)");

        // tipo_doacao = tipo_doacao.join()

        const doacao = await Doacao.create({ tipo_doacao, data, local, doadorId, receptorId })
        return res.status(200).json(doacao)
    },

    async excluir(req, res) {
        const { id } = req.params
        const doacao = await Doacao.findByPk(id)

        if (doacao == null)
            return erro(req, res, "Não foi possível excluir a docao" + id + ", doacao não encontrada");

            doacao.destroy()
        return res.status(200).json(doacao)
    },

    async listarEspecifico(req, res) {
        const { id } = req.params
        const doacao = await Doacao.findByPk(id)

        if (doacao == null)
            return erro(req, res, "Não foi possível recuperar os dados da docao " + id + ", doacao não encontrada");

        return res.status(200).json(doacao)
    },


}

