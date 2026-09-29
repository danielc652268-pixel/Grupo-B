const db = require('../../db.js')

const crear = (datos, callback) => {
    const sql = `
        INSERT INTO reportes (usuario_id, apartamento_id, area_comun_id, categoria, descripcion)
        VALUES (?, ?, ?, ?, ?)
    `
    db.query(
        sql,
        [datos.usuario_id, datos.apartamento_id, datos.area_comun_id, datos.categoria, datos.descripcion],
        callback
    )
}

const obtenerMiApartamento = (usuarioId, callback) => {
    const sql = "SELECT id, nombre, residencial_id FROM apartamento_casa WHERE usuario_id = ? LIMIT 1"
    db.query(sql, [usuarioId], callback)
}

const obtenerResidencialDeUsuario = (usuarioId, callback) => {
    const sql = "SELECT residencial_id FROM usuarios WHERE id = ?"
    db.query(sql, [usuarioId], callback)
}

module.exports = { crear, obtenerMiApartamento, obtenerResidencialDeUsuario }