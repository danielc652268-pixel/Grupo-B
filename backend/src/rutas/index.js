const express = require("express");
const route = express.Router()
const models = require('../models/index')
const { verifyToken, SECRET } = require("../middleware/jwt.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

route.get("/test", verifyToken, (req, res) => {

    res.status(200).send("working properly")


})

//login endpoint
route.post("/login", async (req,res) => {

    const {email, password} = req.body

    models.logIn(email, async (error, results) => {

        if(error) {
            res.status(400).send({error: "error encontrando datos"})
            return;
        }

        const user = results[0]

        if(!user) {
            res.status(401).send("Usuario no encontrado")
            return
        }

        const compare = await bcrypt.compare(password, user.password)
        if(!compare) {
            res.status(401).send("Incorrect Password")
            return
        }

        
                const token = jwt.sign(
            {id: user.id, username: user.email, role: user.role_id},
            SECRET,
            {expiresIn: "2h"}
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

route.post("/register",  (req, res) => {
         
    const {nombre, password, email, role_id} = req.body
    

    if(!nombre || !password|| !email) {
        return res.status(400).send("Error debido a que faltan datos")
    }

    const validPassword = bcrypt.hashSync(password, 10)

    models.register(nombre, email, validPassword, role_id, (error, results) => {

    if(error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).send({ error: "El correo ya está registrado" });
        }
        console.log(error)
        return res.status(500).send({error: "Error guardando datos"})
    }
    res.status(200).send(results)
})


})


route.post("/", (req, res) => {

    const {edificio, direccion} = req.body

    models.postClient(edificio, direccion, (error, results) => {
        if(error) {
            res.status(500).send(error)
            return;
        }
        res.status(200).json(results)
    })
})



route.get("/maintenance", (req,res) => {
    
})



//login Overdue maintenance

route.post("/maintenance", verifyToken, async (req, res) => { 

    const {estado} = req.body

    const userInfo = req.user

    console.log(userInfo)

    if(!userInfo || userInfo?.role != 2) {
        res.status(400).send({error: "no permission"})
        return;
    }

    models.overDueMaintenance(estado, (error, results) => {
        if(error) {
            res.status(500).send({error: "error obteniendo datos"})
            return;
        }
        
        res.status(200).send(results)
        
    })
})

module.exports = route