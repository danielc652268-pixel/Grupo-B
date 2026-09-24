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

const actualizarResidencial = async (req, res) => {
    try {
        const resultado = await residencialService.actualizarResidencial(req.params.id, req.body)
        res.status(200).send(resultado)
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message || "Error actualizando residencial" })
    }
}

const desactivarResidencial = async (req, res) => {
    try {
        const resultado = await residencialService.desactivarResidencial(req.params.id)
        res.status(200).send(resultado)
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message || "Error desactivando residencial" })
    }
}

module.exports = {
    crearResidencial,
    obtenerResidenciales,
    actualizarResidencial,
    desactivarResidencial,
}
