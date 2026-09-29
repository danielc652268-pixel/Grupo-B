const reporteModel = require('../models/reporte.model')
const areaComunModel = require('../models/areaComun.model')

const CATEGORIAS_VALIDAS = ['PLOMERIA', 'ELECTRICIDAD', 'ELEVADOR', 'ESTRUCTURAL', 'OTRO']

const obtenerMiApartamento = (usuarioId) => {
    return new Promise((resolve, reject) => {
        reporteModel.obtenerMiApartamento(usuarioId, (error, results) => {
            if (error) return reject({ status: 500, message: "Error obteniendo el apartamento", error })
            resolve(results[0] || null)
        })
    })
}

const obtenerResidencialDeUsuario = (usuarioId) => {
    return new Promise((resolve, reject) => {
        reporteModel.obtenerResidencialDeUsuario(usuarioId, (error, results) => {
            if (error) return reject({ status: 500, message: "Error obteniendo el residencial", error })
            resolve(results[0]?.residencial_id || null)
        })
    })
}

const obtenerAreasComunes = (residencialId) => {
    return new Promise((resolve, reject) => {
        if (!residencialId) return resolve([])
        areaComunModel.listarPorResidencial(residencialId, (error, results) => {
            if (error) return reject({ status: 500, message: "Error obteniendo áreas comunes", error })
            resolve(results)
        })
    })
}

const crearReporte = (usuarioId, datos) => {
    return new Promise((resolve, reject) => {
        const { ubicacion, apartamento_id, area_comun_id, categoria, descripcion } = datos

        if (!categoria || !CATEGORIAS_VALIDAS.includes(categoria)) {
            return reject({ status: 400, message: "Categoría inválida" })
        }
        if (!descripcion || !descripcion.trim()) {
            return reject({ status: 400, message: "La descripción es obligatoria" })
        }
        if (ubicacion === 'apartamento' && !apartamento_id) {
            return reject({ status: 400, message: "No tienes un apartamento asignado" })
        }
        if (ubicacion === 'area_comun' && !area_comun_id) {
            return reject({ status: 400, message: "Selecciona un área común" })
        }

        const payload = {
            usuario_id: usuarioId,
            apartamento_id: ubicacion === 'apartamento' ? apartamento_id : null,
            area_comun_id: ubicacion === 'area_comun' ? area_comun_id : null,
            categoria,
            descripcion: descripcion.trim(),
        }

        reporteModel.crear(payload, (error, results) => {
            if (error) return reject({ status: 500, message: "Error guardando el reporte", error })
            resolve({ id: results.insertId, ...payload })
        })
    })
}

module.exports = { obtenerMiApartamento, obtenerResidencialDeUsuario, obtenerAreasComunes, crearReporte }