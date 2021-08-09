const express = require('express');
const UsuarioController = require('./controllers/usuarioController.js')

const routes = express.Router()

// ======================= HOME ==============================
routes.get('/',  (req, res)=>{
    return res.json({message: 'Funcionou'})
});

// ======================= Login ==============================
routes.post('/login', UsuarioController.login);

// ======================= Usuarios ==============================
routes.get('/usuarios', UsuarioController.listar);
routes.get('/usuarios/:id', UsuarioController.listarEspecifico);
routes.post('/usuarios', UsuarioController.cadastrar);
//routes.put('/usuarios/:id', UsuarioController.editar);
routes.put('/usuarios', UsuarioController.editar);
routes.delete('/usuarios/:id', UsuarioController.excluir);

module.exports = routes;