const usuarioService = require('../services/usuario.service')

const obtenerUsuarios = async (req, res) => {
    try {
        const resultado = await usuarioService.listarUsuarios()
        res.status(200).send(resultado)
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message || "Error obteniendo usuarios" })
    }
}

module.exports = {
    obtenerUsuarios,
}
