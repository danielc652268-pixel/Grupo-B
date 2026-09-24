const db = require('../../db.js')

const listar = (callback) => {
    const sql = `
        SELECT u.id, u.nombre, u.email, u.role_id, r.nombre AS rol, u.estado, u.created_at
        FROM usuarios u
        JOIN roles r ON r.id = u.role_id
        ORDER BY u.created_at DESC
    `

    db.query(sql, callback)
}

module.exports = {
    listar,
}
