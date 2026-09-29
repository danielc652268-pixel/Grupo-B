const db = require('../../db.js')

const listarPorResidencial = (residencialId, callback) => {
    const sql = "SELECT id, nombre FROM areas_comunes WHERE residencial_id = ?"
    db.query(sql, [residencialId], callback)
}

module.exports = { listarPorResidencial }