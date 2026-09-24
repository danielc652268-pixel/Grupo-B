const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
dotenv.config();

const SECRET = "secret"

const verifyToken = (req, res, next) => {

    const token  = req.cookies.token

    if(!token) {
        return res.status(401).send({error: "Authentication error"})
    }

    jwt.verify(token, SECRET, (error, decode) => {
        if(error) {
            res.status(401).send("error with the Token")
        }

        req.user = decode
        next(); 
    })
}

module.exports = {
    verifyToken,
    SECRET
}