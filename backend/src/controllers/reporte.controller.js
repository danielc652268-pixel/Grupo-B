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
        console.log(error)
        res.status(error.status || 500).send({ error: error.message || "Error creando el reporte" })
        
    }
}

const obtenerReportesPendientes = async (req, res) => {
    try {
        const resultado = await reporteService.listarReportesPendientes()
        res.status(200).send(resultado)
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message || "Error obteniendo los reportes pendientes" })
    }
}

const asignarTecnico = async (req, res) => {
    try {
        const resultado = await reporteService.asignarTecnico(req.params.id, req.body.tecnico_id, req.body.fecha_programada)
        res.status(200).send(resultado)
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send({ error: error.message || "Error asignando el técnico" })
    }
}

const obtenerReportesAsignados = async (req, res) => {
    try {
        const resultado = await reporteService.listarReportesAsignados()
        res.status(200).send(resultado)
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message || "Error obteniendo los reportes asignados" })
    }
}

module.exports = {
    obtenerDatosFormulario,
    crearReporte,
    obtenerReportesPendientes,
    asignarTecnico,
    obtenerReportesAsignados,
}