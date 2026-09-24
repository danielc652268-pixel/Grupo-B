const residencialModel = require('../models/residencial.model')

const ESTADOS_VALIDOS = ['Activo', 'En Construcción', 'Inactivo']

const registrarResidencial = ({ nombre, direccion, ciudad, telefono, estado, fechaRegistro }) => {
    return new Promise((resolve, reject) => {
        if (!nombre || !direccion || !ciudad || !telefono || !estado || !fechaRegistro) {
            reject({ status: 400, message: "Faltan datos del residencial" })
            return
        }

        if (!ESTADOS_VALIDOS.includes(estado)) {
            reject({ status: 400, message: "Estado inválido" })
            return
        }

        residencialModel.crear(
            { nombre, direccion, ciudad, telefono, estado, fecha_registro: fechaRegistro },
            (error, results) => {
                if (error) {
                    reject({ status: 500, message: "Error guardando el residencial", error })
                    return
                }
                resolve(results)
            }
        )
    })
}

const listarResidenciales = () => {
    return new Promise((resolve, reject) => {
        residencialModel.listar((error, results) => {
            if (error) {
                reject({ status: 500, message: "Error obteniendo residenciales", error })
                return
            }
            resolve(results)
        })
    })
}

const actualizarResidencial = (id, { nombre, direccion, ciudad, telefono, estado, fechaRegistro }) => {
    return new Promise((resolve, reject) => {
        if (!nombre || !direccion || !ciudad || !telefono || !estado || !fechaRegistro) {
            reject({ status: 400, message: "Faltan datos del residencial" })
            return
        }

        if (!ESTADOS_VALIDOS.includes(estado)) {
            reject({ status: 400, message: "Estado inválido" })
            return
        }

        residencialModel.actualizar(
            id,
            { nombre, direccion, ciudad, telefono, estado, fecha_registro: fechaRegistro },
            (error, results) => {
                if (error) {
                    reject({ status: 500, message: "Error actualizando el residencial", error })
                    return
                }

                if (results.affectedRows === 0) {
                    reject({ status: 404, message: "Residencial no encontrado" })
                    return
                }

                resolve(results)
            }
        )
    })
}

const desactivarResidencial = (id) => {
    return new Promise((resolve, reject) => {
        residencialModel.desactivar(id, (error, results) => {
            if (error) {
                reject({ status: 500, message: "Error desactivando el residencial", error })
                return
            }

            if (results.affectedRows === 0) {
                reject({ status: 404, message: "Residencial no encontrado" })
                return
            }

            resolve(results)
        })
    })
}

module.exports = {
    registrarResidencial,
    listarResidenciales,
    actualizarResidencial,
    desactivarResidencial,
}
