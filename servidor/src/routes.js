const express = require('express');
const UsuarioController = require('./controllers/usuarioController.js')
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

//routes.put('/usuarios/:id', UsuarioController.editar);

module.exports = routes;