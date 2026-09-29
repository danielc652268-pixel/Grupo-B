const reporteService = require('../services/reporte.service')

const obtenerDatosFormulario = async (req, res) => {
    try {
        const apartamento = await reporteService.obtenerMiApartamento(req.user.id)
        const residencialId = apartamento?.residencial_id || await reporteService.obtenerResidencialDeUsuario(req.user.id)
        const areas = await reporteService.obtenerAreasComunes(residencialId)
        res.status(200).send({ apartamento, areas })
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message || "Error obteniendo datos del formulario" })
    }
}

const crearReporte = async (req, res) => {
    try {
        const resultado = await reporteService.crearReporte(req.user.id, req.body)
        res.status(201).send(resultado)
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message || "Error creando el reporte" })
    }
}

module.exports = { obtenerDatosFormulario, crearReporte }