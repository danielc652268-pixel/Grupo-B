const tecnicoModel = require('../models/tecnico.model')

const listarTecnicos = () => {
    return new Promise((resolve, reject) => {
        tecnicoModel.listar((error, results) => {
            if (error) return reject({ status: 500, message: "Error obteniendo los técnicos", error })
            resolve(results)
        })
    })
}

module.exports = { listarTecnicos }
