const residencialService = require('../services/residencial.service')

const crearResidencial = async (req, res) => {
    try {
        const resultado = await residencialService.registrarResidencial(req.body)
        res.status(201).send(resultado)
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message || "Error registrando residencial" })
    }
}

const obtenerResidenciales = async (req, res) => {
    try {
        const resultado = await residencialService.listarResidenciales()
        res.status(200).send(resultado)
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message || "Error obteniendo residenciales" })
    }
}

module.exports = {
    crearResidencial,
    obtenerResidenciales,
}
