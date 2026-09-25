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

const listarEdificios = (callback) => {
    const sql = "SELECT id, residencial_id, nombre FROM edificios ORDER BY id ASC"

    db.query(sql, callback)
}

const crearEdificios = (residencialId, nombres, callback) => {
    const sql = "INSERT INTO edificios (residencial_id, nombre) VALUES ?"
    const valores = nombres.map((nombre) => [residencialId, nombre])

    db.query(sql, [valores], callback)
}

const eliminarEdificiosPorResidencial = (residencialId, callback) => {
    const sql = "DELETE FROM edificios WHERE residencial_id = ?"

    db.query(sql, [residencialId], callback)
}

module.exports = {
    crear,
    listar,
    actualizar,
    desactivar,
    listarEdificios,
    crearEdificios,
    eliminarEdificiosPorResidencial,
}
