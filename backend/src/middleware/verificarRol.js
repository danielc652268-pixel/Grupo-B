const verificarRol = (...rolesPermitidos) => (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.role)) {
        return res.status(403).send({ error: "No tienes permiso para realizar esta acción" })
    }
    next()
}

module.exports = { verificarRol }
