exports.erro = function(req, res, msg) {
    return res.status(400).json({
        "codigo": '0',
        "mensagem": msg
    })
}
