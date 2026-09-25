const db = require('../../db.js')

const crearApartamento = (datos, callback) => {
    const sql = "INSERT INTO apartamento_casa (nombre, numero_apartamento, piso_apartamento, residencial_id, usuario_id) VALUES (?, ?, ?, ?, ?)"

    db.query(
        sql,
        [datos.nombre, datos.numero_apartamento, datos.piso_apartamento, datos.residencial_id, datos.usuario_id],
        callback
    )
}

const listarApartamento = (callback) => {
    const sql = `
        SELECT apartamento_casa.*, residenciales.nombre AS residencial_nombre, usuarios.nombre AS residente_nombre
        FROM apartamento_casa
        JOIN residenciales ON residenciales.id = apartamento_casa.residencial_id
        LEFT JOIN usuarios ON usuarios.id = apartamento_casa.usuario_id
        ORDER BY apartamento_casa.created_at DESC
    `

    db.query(sql, callback)
}

const actualizarApartamento = (id, datos, callback) => {
    const sql = "UPDATE apartamento_casa SET nombre = ?, numero_apartamento = ?, piso_apartamento = ?, residencial_id = ?, usuario_id = ? WHERE id = ?"

    db.query(
        sql,
        [datos.nombre, datos.numero_apartamento, datos.piso_apartamento, datos.residencial_id, datos.usuario_id, id],
        callback
    )
}

const desactivarApartamento = (id, callback) => {
    const sql = "UPDATE apartamento_casa SET estado = 0 WHERE id = ?"

    db.query(sql, [id], callback)
}

const eliminarApartamento = (id, callback) => {
    const sql = "DELETE FROM apartamento_casa WHERE id = ?"

    db.query(sql, [id], callback)
}

module.exports = {
    crearApartamento,
    listarApartamento,
    actualizarApartamento,
    desactivarApartamento,
    eliminarApartamento,
}
