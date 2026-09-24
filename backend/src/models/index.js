const db = require('../../db.js');

const getUser = (callback) => {

    const sql = "SELECT * FROM user"

    db.query(
        sql,
        callback
    )
}


const postClient = (edificio, direccion, callback) => {

    const sql = " INSERT INTO maintenance (edificio, direccion) VALUES(?,?)"

    db.query(
        sql,
        [edificio, direccion],
        callback
    )

}


const logIn = (email, callback) => {
    const sql = "SELECT * FROM usuarios WHERE email = ? "

    db.query(
        sql,
        [email],
        callback
    )
}

const register = (nombre, email, password, role_id, callback) => {
    const sql = "INSERT INTO usuarios (nombre, email, password, role_id) VALUES(?,?,?,?)"

    db.query(
        sql,
        [nombre, email, password, role_id],
        callback
    )
}

const maintenance = (estado, callback) => {
    const sql = "SELECT * FROM  maintenance WHERE estado = ?"

    db.query(
        sql,
        [estado],
        callback
    )
}

const overDueMaintenance = (estado, callback) => {
    const sql = "SELECT * FROM mantenimientos m WHERE estado_id = (SELECT id FROM estados_mantenimiento WHERE nombre = ?) and fecha_programada < NOW()"


    db.query(
        sql,
        [estado],
        callback
    )

}



module.exports = ({
    postClient,
    getUser,
    logIn,
    register,
    overDueMaintenance
})