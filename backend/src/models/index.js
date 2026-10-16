const db = require('../../db.js');





const logIn = (email, callback) => {
    const sql = "SELECT * FROM usuarios WHERE email = ? "

    db.query(
        sql,
        [email],
        callback
    )
}

const register = (nombre, email, password, role_id, residencial_id, callback) => {
    const sql = "INSERT INTO usuarios (nombre, email, password, role_id, residencial_id) VALUES(?,?,?,?,?)"

    db.query(
        sql,
        [nombre, email, password, role_id, residencial_id || null],
        callback
    )
}



const mantenimientosDeTecnico = (tecnicoId, callback) => {
    const sql = `SELECT r.id,
                        r.fecha_reporte AS fecha_creacion,
                        r.categoria AS tipo,
                        u.nombre AS tecnico,
                        r.descripcion,
                        r.fecha_programada,
                        e.nombre AS estado,
                        CASE WHEN e.nombre = 'COMPLETADO' THEN
                            (SELECT MAX(c.created_at) FROM reporte_comentarios c
                             WHERE c.reporte_id = r.id AND c.estado_id = r.estado_id)
                        END AS fecha_cierre
                 FROM reportes r
                 JOIN usuarios u ON u.id = r.tecnico_id
                 JOIN estados_mantenimiento e ON e.id = r.estado_id
                 WHERE r.tecnico_id = ?
                 ORDER BY r.fecha_programada IS NULL, r.fecha_programada ASC, r.fecha_reporte DESC`

    db.query(
        sql,
        [tecnicoId],
        callback
    )
}

const ESTADOS_CERRADOS = ['COMPLETADO', 'CANCELADO']

// Registra un avance del tecnico sobre uno de SUS reportes y, si se indica, cambia el estado.
const registrarProgreso = async (reporteId, tecnicoId, estado, comentario) => {
    const conn = db.promise()

    const [reportes] = await conn.query(
        `SELECT r.id, e.nombre AS estado
         FROM reportes r
         JOIN estados_mantenimiento e ON e.id = r.estado_id
         WHERE r.id = ? AND r.tecnico_id = ?`,
        [reporteId, tecnicoId]
    )

    if (!reportes.length) return { error: 'NO_ENCONTRADO' }
    if (ESTADOS_CERRADOS.includes(reportes[0].estado)) return { error: 'CERRADO' }

    if (estado) {
        await conn.query(
            "UPDATE reportes SET estado_id = (SELECT id FROM estados_mantenimiento WHERE nombre = ?) WHERE id = ?",
            [estado, reporteId]
        )
    }

    await conn.query(
        `INSERT INTO reporte_comentarios (reporte_id, usuario_id, comentario, estado_id)
         SELECT id, ?, ?, estado_id FROM reportes WHERE id = ?`,
        [tecnicoId, comentario || null, reporteId]
    )

    return { ok: true }
}

const comentariosDeReporte = (reporteId, tecnicoId, callback) => {
    const sql = `SELECT c.id, c.comentario, c.created_at, e.nombre AS estado
                 FROM reporte_comentarios c
                 JOIN reportes r ON r.id = c.reporte_id
                 JOIN estados_mantenimiento e ON e.id = c.estado_id
                 WHERE c.reporte_id = ? AND r.tecnico_id = ?
                 ORDER BY c.created_at DESC, c.id DESC`

    db.query(
        sql,
        [reporteId, tecnicoId],
        callback
    )
}




module.exports = ({
    logIn,
    register,
    mantenimientosDeTecnico,
    registrarProgreso,
    comentariosDeReporte,
})