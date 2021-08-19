const express = require('express');
const UsuarioController = require('./controllers/usuarioController.js')
const DoacaoController = require('./controllers/doacaoController.js')
const SolicitacaoController = require('./controllers/solicitacaoController.js')
const jwt = require('jsonwebtoken');

const routes = express.Router()

function erro(req, res, msg) {
    return res.status(400).json({
        "codigo": '0',
        "mensagem": msg
    })
}

function verifyJWT(req, res, next) {
    const token = req.headers['token'];
    if (!token) return erro(req, res, "Falha ao autorizar - token não enviado");

    jwt.verify(token, 'segredo', function (err, decoded) {
        if (err) return erro(req, res, "Falha ao autorizar - token invalido");

        // se tudo estiver ok, salva no request para uso posterior
        console.log(decoded);
        next();
    });
}

// ======================= HOME ==============================
routes.get('/', (req, res) => {
    return res.json({ message: 'Funcionou' })
});

// ======================= Login ==============================
routes.post('/login', UsuarioController.login);

routes.post('/logout', verifyJWT, (req, res) => {
    UsuarioController.logout(req, res)
})

// ======================= Usuarios ==============================
routes.get('/usuarios', UsuarioController.listar);

routes.get('/usuarios/:id', verifyJWT, (req, res) => {
    UsuarioController.listarEspecifico(req, res)
})

routes.post('/usuarios', UsuarioController.cadastrar);

routes.put('/usuarios', verifyJWT, (req, res) => {
    UsuarioController.editar(req, res)
})

routes.delete('/usuarios/:id', verifyJWT, (req, res) => {
    UsuarioController.excluir(req, res)
})

// ======================= Doacao ==============================
routes.get('/doacoes', DoacaoController.listar);

routes.get('/doacoes/:id', verifyJWT, (req, res) => {
    DoacaoController.listarEspecifico(req, res)
})

routes.get('/usuarios/:id/doacoes', verifyJWT, (req, res) => {
    DoacaoController.doacoesDoUsuario(req, res)
})

routes.post('/doacoes', verifyJWT, (req, res) => {
    DoacaoController.cadastrar(req, res)
})

routes.put('/doacoes', verifyJWT, (req, res) => {
    DoacaoController.editar(req, res)
})

routes.delete('/doacoes/:id', verifyJWT, (req, res) => {
    DoacaoController.excluir(req, res)
})

//routes.put('/usuarios/:id', UsuarioController.editar);


// ======================= Solicitacao ==============================
routes.get('/solicitacoes', SolicitacaoController.listar);

routes.get('/solicitacoes/:id', verifyJWT, (req, res) => {
    SolicitacaoController.listarEspecifico(req, res)
})

routes.get('/usuarios/:id/solicitacoes', verifyJWT, (req, res) => {
    SolicitacaoController.solicitacoesDoUsuario(req, res)
})

routes.post('/solicitacoes', verifyJWT, (req, res) => {
    SolicitacaoController.cadastrar(req, res)
})

routes.put('/solicitacoes', verifyJWT, (req, res) => {
    SolicitacaoController.editar(req, res)
})

routes.delete('/solicitacoes/:id', verifyJWT, (req, res) => {
    SolicitacaoController.excluir(req, res)
})

module.exports = routes;