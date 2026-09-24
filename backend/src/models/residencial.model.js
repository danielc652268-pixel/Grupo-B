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
    const sql = "SELECT * FROM residenciales ORDER BY created_at DESC"

    db.query(sql, callback)
}

module.exports = {
    crear,
    listar,
}
