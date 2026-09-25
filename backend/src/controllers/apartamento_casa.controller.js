const apartamentoCasaService = require('../services/apartamento_casa.service')

const crearApartamento = async (req, res) => {
    try {
        const resultado = await apartamentoCasaService.registrarApartamento(req.body)
        res.status(201).send(resultado)
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message || "Error creando apartamento" })
    }
}

const obtenerApartamentos = async (req, res) => {
    try {
        const resultado = await apartamentoCasaService.listarApartamentos()
        res.status(200).send(resultado)
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message || "Error obteniendo apartamentos" })
    }
}

const actualizarApartamento = async (req, res) => {
    try {
        const resultado = await apartamentoCasaService.actualizarApartamento(req.params.id, req.body)
        res.status(200).send(resultado)
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message || "Error actualizando apartamento" })
    }
}

const desactivarApartamento = async (req, res) => {
    try {
        const resultado = await apartamentoCasaService.desactivarApartamento(req.params.id)
        res.status(200).send(resultado)
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message || "Error desactivando apartamento" })
    }
}

const eliminarApartamento = async (req, res) => {
    try {
        const resultado = await apartamentoCasaService.eliminarApartamento(req.params.id)
        res.status(200).send(resultado)
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message || "Error eliminando apartamento" })
    }
}

module.exports = {
    crearApartamento,
    obtenerApartamentos,
    actualizarApartamento,
    desactivarApartamento,
    eliminarApartamento,
}