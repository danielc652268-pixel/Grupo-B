const db = require('../../db.js')

const crear = (datos, callback) => {
    const sql = "INSERT INTO residenciales (nombre, direccion, ciudad, telefono, estado, fecha_registro) VALUES (?, ?, ?, ?, ?, ?)"

    db.query(
        sql,
        [datos.nombre, datos.direccion, datos.ciudad, datos.telefono, datos.estado, datos.fecha_registro],
        callback
    )
}

const listar = (callback) => {
    const sql = "SELECT * FROM residenciales ORDER BY id DESC"

    db.query(sql, callback)
}

const actualizar = (id, datos, callback) => {
    const sql = "UPDATE residenciales SET nombre = ?, direccion = ?, ciudad = ?, telefono = ?, estado = ?, fecha_registro = ? WHERE id = ?"

    db.query(
        sql,
        [datos.nombre, datos.direccion, datos.ciudad, datos.telefono, datos.estado, datos.fecha_registro, id],
        callback
    )
}

const desactivar = (id, callback) => {
    const sql = "UPDATE residenciales SET estado = 'Inactivo' WHERE id = ?"

    db.query(sql, [id], callback)
}

module.exports = {
    crear,
    listar,
    actualizar,
    desactivar,
}
