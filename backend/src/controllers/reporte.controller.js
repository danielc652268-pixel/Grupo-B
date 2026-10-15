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

const obtenerTodosLosReportes = async (req, res) => {
    try {
        const { residencial_id, estado, tecnico_id } = req.query
        const resultado = await reporteService.listarTodosLosReportes({ residencial_id, estado, tecnico_id })
        res.status(200).send(resultado)
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message || "Error obteniendo los reportes" })
    }
}

const eliminarReporte = async (req, res) => {
    try {
        const resultado = await reporteService.eliminarReporte(req.params.id)
        res.status(200).send(resultado)
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message || "Error eliminando el reporte" })
    }
}

const reasignarTecnico = async (req, res) => {
    try {
        const { tecnico_id, fecha_programada } = req.body
        const resultado = await reporteService.reasignarTecnico(req.params.id, tecnico_id, fecha_programada)
        res.status(200).send(resultado)
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message || "Error actualizando el reporte" })
    }
}

module.exports = {
    obtenerDatosFormulario,
    crearReporte,
    obtenerReportesPendientes,
    asignarTecnico,
    obtenerReportesAsignados,
    obtenerTodosLosReportes,
    eliminarReporte,
    reasignarTecnico
}