const usuarioModel = require('../models/usuario.model')

const listarUsuarios = () => {
    return new Promise((resolve, reject) => {
        usuarioModel.listar((error, results) => {
            if (error) {
                reject({ status: 500, message: "Error obteniendo usuarios", error })
                return
            }
            resolve(results)
        })
    })
}

module.exports = {
    listarUsuarios,
}
