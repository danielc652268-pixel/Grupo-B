const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
dotenv.config();

const SECRET = process.env.JWT_SECRET

const verifyToken = (req, res, next) => {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).send({ error: "Authentication error" })
    }

    jwt.verify(token, SECRET, (error, decode) => {
        if (error) {
            return res.status(401).send("error with the Token")
        }

        req.user = decode
        next();
    })
}

module.exports = {
    verifyToken,
    SECRET
}