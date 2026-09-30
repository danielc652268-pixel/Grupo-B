const db = require('../../db.js')

const listar = (callback) => {
    const sql = `
        SELECT id, nombre, email
        FROM usuarios
        WHERE role_id = 2 AND estado = 1
        ORDER BY nombre ASC
    `
    db.query(sql, callback)
}

const obtenerPorId = (id, callback) => {
    const sql = `
        SELECT id, nombre, email
        FROM usuarios
        WHERE id = ? AND role_id = 2 AND estado = 1
    `
    db.query(sql, [id], callback)
}

module.exports = { listar, obtenerPorId }
