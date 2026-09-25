const residencialModel = require('../models/residencial.model')

const ESTADOS_VALIDOS = ['Activo', 'En Construcción', 'Inactivo']

const validarEdificios = (cantidadEdificios, edificios) => {
    const cantidad = Number(cantidadEdificios)

    if (!cantidad || cantidad < 1) {
        return "La cantidad de edificios debe ser al menos 1"
    }

    if (!Array.isArray(edificios) || edificios.length !== cantidad) {
        return "La cantidad de edificios no coincide con los nombres enviados"
    }

    if (edificios.some((nombre) => !nombre || !String(nombre).trim())) {
        return "Todos los edificios deben tener un nombre"
    }

    return null
}

const registrarResidencial = ({ nombre, direccion, ciudad, telefono, estado, fechaRegistro, cantidadEdificios, edificios }) => {
    return new Promise((resolve, reject) => {
        if (!nombre || !direccion || !ciudad || !telefono || !estado || !fechaRegistro) {
            reject({ status: 400, message: "Faltan datos del residencial" })
            return
        }

        if (!ESTADOS_VALIDOS.includes(estado)) {
            reject({ status: 400, message: "Estado inválido" })
            return
        }

        const errorEdificios = validarEdificios(cantidadEdificios, edificios)
        if (errorEdificios) {
            reject({ status: 400, message: errorEdificios })
            return
        }

        residencialModel.crear(
            { nombre, direccion, ciudad, telefono, estado, fecha_registro: fechaRegistro },
            (error, results) => {
                if (error) {
                    reject({ status: 500, message: "Error guardando el residencial", error })
                    return
                }

                residencialModel.crearEdificios(results.insertId, edificios, (errorEdificios) => {
                    if (errorEdificios) {
                        reject({ status: 500, message: "Error guardando los edificios del residencial", error: errorEdificios })
                        return
                    }
                    resolve(results)
                })
            }
        )
    })
}

const listarResidenciales = () => {
    return new Promise((resolve, reject) => {
        residencialModel.listar((error, residenciales) => {
            if (error) {
                reject({ status: 500, message: "Error obteniendo residenciales", error })
                return
            }

            residencialModel.listarEdificios((errorEdificios, edificios) => {
                if (errorEdificios) {
                    reject({ status: 500, message: "Error obteniendo los edificios", error: errorEdificios })
                    return
                }

                const resultado = residenciales.map((residencial) => {
                    const edificiosDelResidencial = edificios
                        .filter((edificio) => edificio.residencial_id === residencial.id)
                        .map((edificio) => ({ id: edificio.id, nombre: edificio.nombre }))

                    return {
                        ...residencial,
                        cantidad_edificios: edificiosDelResidencial.length,
                        edificios: edificiosDelResidencial,
                    }
                })

                resolve(resultado)
            })
        })
    })
}

const actualizarResidencial = (id, { nombre, direccion, ciudad, telefono, estado, fechaRegistro, cantidadEdificios, edificios }) => {
    return new Promise((resolve, reject) => {
        if (!nombre || !direccion || !ciudad || !telefono || !estado || !fechaRegistro) {
            reject({ status: 400, message: "Faltan datos del residencial" })
            return
        }

        if (!ESTADOS_VALIDOS.includes(estado)) {
            reject({ status: 400, message: "Estado inválido" })
            return
        }

        const errorEdificios = validarEdificios(cantidadEdificios, edificios)
        if (errorEdificios) {
            reject({ status: 400, message: errorEdificios })
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

                residencialModel.eliminarEdificiosPorResidencial(id, (errorEliminar) => {
                    if (errorEliminar) {
                        reject({ status: 500, message: "Error actualizando los edificios del residencial", error: errorEliminar })
                        return
                    }

                    residencialModel.crearEdificios(id, edificios, (errorCrear) => {
                        if (errorCrear) {
                            reject({ status: 500, message: "Error actualizando los edificios del residencial", error: errorCrear })
                            return
                        }
                        resolve(results)
                    })
                })
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
