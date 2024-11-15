const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

const authenticateJwt = (req, res, next) => {
    const token = req.headers.authorization;

    if(token) {
        const SECRET = process.env.JWT_SECRET;
        jwt.verify(token, SECRET, (err, user) => {
            if(err) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    message: "Invalid token!"
                });
            } else {
                req.userId = user.id;
                next();
            }   
        });
    }
}

module.exports = {
    authenticateJwt
}