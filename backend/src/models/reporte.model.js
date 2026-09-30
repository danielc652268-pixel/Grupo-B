const db = require('../../db.js')

const crear = (datos, callback) => {
    const sql = `
        INSERT INTO reportes (usuario_id, apartamento_id, area_comun_id, categoria, descripcion, estado_id)
        VALUES (?, ?, ?, ?, ?, (SELECT id FROM estados_mantenimiento WHERE nombre = 'PENDIENTE'))
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

const listarPendientes = (callback) => {
    const sql = `
        SELECT
            r.id,
            r.categoria,
            r.descripcion,
            r.fecha_reporte,
            u.nombre AS residente,
            ac.nombre AS apartamento,
            areac.nombre AS area_comun
        FROM reportes r
        JOIN usuarios u ON u.id = r.usuario_id
        JOIN estados_mantenimiento e ON e.id = r.estado_id
        LEFT JOIN apartamento_casa ac ON ac.id = r.apartamento_id
        LEFT JOIN areas_comunes areac ON areac.id = r.area_comun_id
        WHERE e.nombre = 'PENDIENTE'
        ORDER BY r.fecha_reporte ASC
    `
    db.query(sql, callback)
}

const obtenerPorId = (id, callback) => {
    const sql = `
        SELECT r.id, r.estado_id, e.nombre AS estado_nombre
        FROM reportes r
        JOIN estados_mantenimiento e ON e.id = r.estado_id
        WHERE r.id = ?
    `
    db.query(sql, [id], callback)
}

const asignarTecnico = (reporteId, tecnicoId, fechaProgramada, callback) => {
    const sql = `
        UPDATE reportes
        SET tecnico_id = ?, fecha_programada = ?, estado_id = (SELECT id FROM estados_mantenimiento WHERE nombre = 'ASIGNADO')
        WHERE id = ?
    `
    db.query(sql, [tecnicoId, fechaProgramada, reporteId], callback)
}

const listarAsignados = (callback) => {
    const sql = `
        SELECT
            r.id,
            r.categoria,
            r.descripcion,
            r.fecha_reporte,
            DATE_FORMAT(r.fecha_programada, '%Y-%m-%d') AS fecha_programada,
            u.nombre AS residente,
            ac.nombre AS apartamento,
            areac.nombre AS area_comun,
            t.nombre AS tecnico
        FROM reportes r
        JOIN usuarios u ON u.id = r.usuario_id
        JOIN estados_mantenimiento e ON e.id = r.estado_id
        LEFT JOIN apartamento_casa ac ON ac.id = r.apartamento_id
        LEFT JOIN areas_comunes areac ON areac.id = r.area_comun_id
        LEFT JOIN usuarios t ON t.id = r.tecnico_id
        WHERE e.nombre = 'ASIGNADO'
        ORDER BY r.fecha_reporte DESC
    `
    db.query(sql, callback)
}

module.exports = {
    crear,
    obtenerMiApartamento,
    obtenerResidencialDeUsuario,
    listarPendientes,
    obtenerPorId,
    asignarTecnico,
    listarAsignados,
}