const apartamentoCasaModel = require('../models/apartamento_casa.js')

const registrarApartamento = ({ nombre, numero_apartamento, piso_apartamento, residencial_id, usuario_id }) => {
    return new Promise((resolve, reject) => {
        if (!nombre || !numero_apartamento || !piso_apartamento || !residencial_id) {
            reject({ status: 400, message: "Faltan datos del apartamento" })
            return
        }

        apartamentoCasaModel.crearApartamento(
            {
                nombre,
                numero_apartamento: Number(numero_apartamento),
                piso_apartamento: Number(piso_apartamento),
                residencial_id: Number(residencial_id),
                usuario_id: usuario_id ? Number(usuario_id) : null,
            },
            (error, results) => {
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        reject({ status: 409, message: "Ya existe un apartamento con ese número en ese residencial" })
                        return
                    }
                    reject({ status: 500, message: "Error guardando el apartamento", error })
                    return
                }
                resolve(results)
            }
        )
    })
}

const listarApartamentos = () => {
    return new Promise((resolve, reject) => {
        apartamentoCasaModel.listarApartamento((error, results) => {
            if (error) {
                reject({ status: 500, message: "Error obteniendo apartamentos", error })
                return
            }
            resolve(results)
        })
    })
}

const actualizarApartamento = (id, { nombre, numero_apartamento, piso_apartamento, residencial_id, usuario_id }) => {
    return new Promise((resolve, reject) => {
        if (!id) {
            reject({ status: 400, message: "Falta el ID del apartamento" })
            return
        }

        if (!nombre || !numero_apartamento || !piso_apartamento || !residencial_id) {
            reject({ status: 400, message: "Faltan datos del apartamento" })
            return
        }

        apartamentoCasaModel.actualizarApartamento(
            id,
            {
                nombre,
                numero_apartamento: Number(numero_apartamento),
                piso_apartamento: Number(piso_apartamento),
                residencial_id: Number(residencial_id),
                usuario_id: usuario_id ? Number(usuario_id) : null,
            },
            (error, results) => {
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        reject({ status: 409, message: "Ya existe un apartamento con ese número en ese residencial" })
                        return
                    }
                    reject({ status: 500, message: "Error actualizando el apartamento", error })
                    return
                }
                if (results.affectedRows === 0) {
                    reject({ status: 404, message: "Apartamento no encontrado" })
                    return
                }
                resolve(results)
            }
        )
    })
}

const desactivarApartamento = (id) => {
    return new Promise((resolve, reject) => {
        apartamentoCasaModel.desactivarApartamento(id, (error, results) => {
            if (error) {
                reject({ status: 500, message: "Error desactivando el apartamento", error })
                return
            }
            if (results.affectedRows === 0) {
                reject({ status: 404, message: "Apartamento no encontrado" })
                return
            }
            resolve(results)
        })
    })
}

const eliminarApartamento = (id) => {
    return new Promise((resolve, reject) => {
        apartamentoCasaModel.eliminarApartamento(id, (error, results) => {
            if (error) {
                reject({ status: 500, message: "Error eliminando el apartamento", error })
                return
            }
            if (results.affectedRows === 0) {
                reject({ status: 404, message: "Apartamento no encontrado" })
                return
            }
            resolve(results)
        })
    })
}

module.exports = {
    registrarApartamento,
    listarApartamentos,
    actualizarApartamento,
    desactivarApartamento,
    eliminarApartamento,
}
