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
        return res.status(200).json(doacoes)
    },

    async doacoesDoUsuario(req, res) {
        const { id } = req.params;
        const doacoes = await sequelize.query("SELECT * FROM doacao WHERE doadorId = " + id + ";", { type: sequelize.QueryTypes.SELECT });

        if (doacoes.length == 0)
            return erro(req, res, "Não existem doacoes para esse usuario");

        return res.status(200).json(doacoes)
    },

    async editar(req, res) {
        //const {id} = req.params;
        const { id } = req.body
        let { tipo_doacao, data, local, doadorId, quantidade_total, quantidade_restante } = req.body;
        const doacao = await Doacao.findByPk(id);

        if (doacao == null)
            return erro(req, res, "Não foi possível atualizar a doacao " + id + ", doacao não encontrada");

        if (data == '' || data == null)
            return erro(req, res, "Não foi possível atualizar a doacao: data nulo ou vazio");

        if (local == '' || local == null)
            return erro(req, res, "Não foi possível atualizar a doacao: local nulo ou vazio");

        if (doadorId == '' || doadorId == null)
            return erro(req, res, "Não foi possível atualizar a doacao: doadorId nulo ou vazio");

        if (tipo_doacao == '' || tipo_doacao == null)
            return erro(req, res, "Não foi possível atualizar a doacao: tipo_doacao nulo ou vazio");

        if (quantidade_total == '' || quantidade_total == null)
            return erro(req, res, "Não foi possível atualizar a doacao: quantidade_total nulo ou vazio");

        tipo_doacao = verifyTipoDoacao(tipo_doacao)
        if (tipo_doacao == false)
            return erro(req, res, "Não foi possível atualizar a doacao: tipo_doacao deve seguir o formato especificado (CESTA, REMEDIO, ROUPA)");

        tipo_doacao = tipo_doacao.join()

        doacao.tipo_doacao = tipo_doacao
        doacao.data = data
        doacao.local = local
        doacao.doadorId = doadorId
        doacao.quantidade_total = quantidade_total
        doacao.quantidade_restante = quantidade_restante

        const doacao_response = await doacao.save()
        return res.status(200).json(doacao_response)
    },

    async cadastrar(req, res) {
        let { tipo_doacao, data, local, doadorId, quantidade_total, quantidade_restante } = req.body;

        if (data == '' || data == null)
            return erro(req, res, "Não foi possível cadastrar a doacao: data nulo ou vazio");

        if (local == '' || local == null)
            return erro(req, res, "Não foi possível cadastrar a doacao: local nulo ou vazio");

        if (doadorId == '' || doadorId == null)
            return erro(req, res, "Não foi possível cadastrar a doacao: doadorId nulo ou vazio");

        if (tipo_doacao == '' || tipo_doacao == null)
            return erro(req, res, "Não foi possível cadastrar a doacao: tipo_doacao nulo ou vazio");

        //tipo_doacao = verifyTipoDoacao(tipo_doacao)
        if (tipo_doacao == false)
            return erro(req, res, "Não foi possível cadastrar o usuário: tipo_doacao deve seguir o formato especificado (CESTA, REMEDIO, ROUPA)");

        if (tipo_doacao != 'CESTA' && tipo_doacao != 'REMEDIO' && tipo_doacao != 'ROUPA')
            return erro(req, res, "Não foi possível cadastrar o usuário: tipo_doacao deve seguir o formato especificado (CESTA, REMEDIO, ROUPA)");

        if (quantidade_total == '' || quantidade_total == null)
            return erro(req, res, "Não foi possível atualizar a doacao: quantidade_total nulo ou vazio");

        if (quantidade_restante == '' || quantidade_restante == null)
            return erro(req, res, "Não foi possível atualizar a doacao: quantidade_restante nulo ou vazio");


        doacao = await Doacao.create({ tipo_doacao, data, local, doadorId, quantidade_total, quantidade_restante });



        return res.status(200).json(doacao)
    },

    async excluir(req, res) {
        const { id } = req.params
        const doacao = await Doacao.findByPk(id)

        if (doacao == null)
            return erro(req, res, "Não foi possível excluir a docao" + id + ", doacao não encontrada");

        doacao.destroy()
        return res.status(204).json(doacao)
    },

    async listarEspecifico(req, res) {
        const { id } = req.params
        const doacao = await Doacao.findByPk(id)

        if (doacao == null){
            const semnada = []
            return res.status(200).json(semnada)
        }

        return res.status(200).json(doacao)
    },


}

