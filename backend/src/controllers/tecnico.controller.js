const tecnicoService = require('../services/tecnico.service')

const obtenerTecnicos = async (req, res) => {
    try {
        const resultado = await tecnicoService.listarTecnicos()
        res.status(200).send(resultado)
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message || "Error obteniendo técnicos" })
    }
}

module.exports = { obtenerTecnicos }
