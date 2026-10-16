const express = require("express");
const route = express.Router()
const models = require('../models/index')
const { verifyToken, SECRET } = require("../middleware/jwt.js")
const { verificarRol } = require("../middleware/verificarRol.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const residencialController = require('../controllers/residencial.controller')
const usuarioController = require('../controllers/usuario.controller')
const apartamentoCasaController = require('../controllers/apartamento_casa.controller')
const reporteController = require('../controllers/reporte.controller')
const tecnicoController = require('../controllers/tecnico.controller')
const modelpropietario = require("../models/usuario.model.js")

route.get("/test", verifyToken, (req, res) => {

    res.status(200).send("working properly")


})

//login endpoint
route.post("/login", async (req, res) => {

    const { email, password } = req.body

    models.logIn(email, async (error, results) => {

        if (error) {
            res.status(400).send({ error: "error encontrando datos" })
            return;
        }

        const user = results[0]

        if (!user) {
            res.status(401).send("Usuario no encontrado")
            return
        }

        const compare = await bcrypt.compare(password, user.password)
        if (!compare) {
            res.status(401).send("Incorrect Password")
            return
        }


        const token = jwt.sign(
            { id: user.id, username: user.email, role: user.role_id },
            SECRET,
            { expiresIn: "2h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
        });

        return res.status(200).send({
            nombre: user.nombre,
            email: user.email,
            role: user.role_id,
        })
    })


})


//login register

route.post("/register", verifyToken, (req, res) => {

    if (req.user.role !== 1) {
        return res.status(403).send({ error: "No tienes permiso para crear usuarios" })
    }

    const { nombre, password, email, role_id, residencial_id } = req.body


    if (!nombre || !password || !email) {
        return res.status(400).send("Error debido a que faltan datos")
    }

    const validPassword = bcrypt.hashSync(password, 10)

        models.register(nombre, email, validPassword, role_id, residencial_id, (error, results) => {

        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).send({ error: "El correo ya está registrado" });
            }
            console.log(error)
            return res.status(500).send({ error: "Error guardando datos" })
        }
        res.status(200).send(results)
    })


})



route.get("/maintenance", verifyToken, (req, res) => {

    if (req.user.role !== 2) {
        return res.status(403).send({ error: "No tienes permiso para ver los mantenimientos" })
    }

    models.mantenimientosDeTecnico(req.user.id, (error, results) => {
        if (error) {
            console.log(error)
            return res.status(500).send({ error: "error obteniendo datos" })
        }

        res.status(200).send(results)
    })
})



const ESTADOS_PERMITIDOS_TECNICO = ['EN_PROCESO', 'COMPLETADO']

route.patch("/maintenance/:id", verifyToken, async (req, res) => {

    if (req.user.role !== 2) {
        return res.status(403).send({ error: "No tienes permiso para actualizar mantenimientos" })
    }

    const estado = req.body.estado || null
    const comentario = (req.body.comentario || "").trim()

    if (estado && !ESTADOS_PERMITIDOS_TECNICO.includes(estado)) {
        return res.status(400).send({ error: "Estado no permitido" })
    }
    if (!estado && !comentario) {
        return res.status(400).send({ error: "Agrega un comentario o cambia el estado" })
    }
    if (comentario.length > 1000) {
        return res.status(400).send({ error: "El comentario no puede superar 1000 caracteres" })
    }

    try {
        const resultado = await models.registrarProgreso(req.params.id, req.user.id, estado, comentario)

        if (resultado.error === 'NO_ENCONTRADO') {
            return res.status(404).send({ error: "Reporte no encontrado o no asignado a ti" })
        }
        if (resultado.error === 'CERRADO') {
            return res.status(409).send({ error: "El reporte ya está cerrado" })
        }

        res.status(200).send({ mensaje: "Reporte actualizado" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Error actualizando el reporte" })
    }
})

route.get("/maintenance/:id/comentarios", verifyToken, (req, res) => {

    if (req.user.role !== 2) {
        return res.status(403).send({ error: "No tienes permiso para ver los comentarios" })
    }

    models.comentariosDeReporte(req.params.id, req.user.id, (error, results) => {
        if (error) {
            console.log(error)
            return res.status(500).send({ error: "error obteniendo datos" })
        }

        res.status(200).send(results)
    })
})



route.post("/residenciales", verifyToken, (req, res, next) => {
    if (req.user.role !== 1) {
        return res.status(403).send({ error: "No tienes permiso para crear residenciales" })
    }
    next()
}, residencialController.crearResidencial)

route.get("/residenciales", verifyToken, residencialController.obtenerResidenciales)

route.put("/residenciales/:id", verifyToken, (req, res, next) => {
    if (req.user.role !== 1) {
        return res.status(403).send({ error: "No tienes permiso para editar residenciales" })
    }
    next()
}, residencialController.actualizarResidencial)

route.patch("/residenciales/:id/desactivar", verifyToken, (req, res, next) => {
    if (req.user.role !== 1) {
        return res.status(403).send({ error: "No tienes permiso para desactivar residenciales" })
    }
    next()
}, residencialController.desactivarResidencial)

route.patch("/residenciales/:id/activar", verifyToken, (req, res, next) => {
    if (req.user.role !== 1) {
        return res.status(403).send({ error: "No tienes permiso para activar residenciales" })
    }
    next()
}, residencialController.activarResidencial)

route.post("/apartamento", verifyToken, (req, res, next) => {
    if (req.user.role !== 1) {
        return res.status(403).send({ error: "No tienes permiso para crear apartamentos/casas" })
    }
    next()
}, apartamentoCasaController.crearApartamento)

route.get("/apartamento", verifyToken, apartamentoCasaController.obtenerApartamentos)

route.put("/apartamento/:id", verifyToken, (req, res, next) => {
    if (req.user.role !== 1) {
        return res.status(403).send({ error: "No tienes permiso para editar apartamentos/casas" })
    }
    next()
}, apartamentoCasaController.actualizarApartamento)

route.patch("/apartamento/:id/desactivar", verifyToken, (req, res, next) => {
    if (req.user.role !== 1) {
        return res.status(403).send({ error: "No tienes permiso para desactivar apartamentos/casas" })
    }
    next()
}, apartamentoCasaController.desactivarApartamento)

route.delete("/apartamento/:id", verifyToken, (req, res, next) => {
    if (req.user.role !== 1) {
        return res.status(403).send({ error: "No tienes permiso para eliminar apartamentos/casas" })
    }
    next()
}, apartamentoCasaController.eliminarApartamento)

route.get("/usuarios", verifyToken, (req, res, next) => {
    if (req.user.role !== 1) {
        return res.status(403).send({ error: "No tienes permiso para ver los usuarios" })
    }
    next()
}, usuarioController.obtenerUsuarios)

route.get("/me", verifyToken, (req, res) => {
    res.set('Cache-Control', 'no-store')
    res.status(200).send(req.user)
})

route.post("/logout", (req, res) => {
    res.clearCookie("token")
    res.status(200).send({ message: "Sesión cerrada" })
})

route.get("/reportes/formulario", verifyToken, (req, res, next) => {
    if (req.user.role !== 3) {
        return res.status(403).send({ error: "Solo un residente puede ver este formulario" })
    }
    next()
}, reporteController.obtenerDatosFormulario)

route.post("/reportes", verifyToken, (req, res, next) => {
    if (req.user.role !== 3) {
        return res.status(403).send({ error: "Solo un residente puede crear reportes" })
    }
    next()
}, reporteController.crearReporte)

route.get("/propietarios", verifyToken, verificarRol(1), (req, res) => {
    modelpropietario.propietarios((error, resutls) => {
        if(error) {
            return res.status(400).send({error: "error dando propietaios"})
        }

        return res.status(200).send(resutls)
    })
}

)



route.get("/reportes/pendientes", verifyToken, verificarRol(1), reporteController.obtenerReportesPendientes)

route.get("/reportes/asignados", verifyToken, verificarRol(1), reporteController.obtenerReportesAsignados)

route.patch("/reportes/:id/asignar", verifyToken, verificarRol(1), reporteController.asignarTecnico)

route.get("/tecnicos", verifyToken, verificarRol(1), tecnicoController.obtenerTecnicos)

route.get("/reportes", verifyToken, verificarRol(1), reporteController.obtenerTodosLosReportes)

route.get("/reportes/:id", verifyToken, verificarRol(1), reporteController.obtenerDetalleReporte)

route.delete("/reportes/:id", verifyToken, verificarRol(1), reporteController.eliminarReporte)

route.patch("/reportes/:id/reasignar", verifyToken, verificarRol(1), reporteController.reasignarTecnico)

module.exports = route
