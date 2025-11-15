const jwt = require('jsonwebtoken')

function auth(req, res, next) {
    try {
        let token = req.headers.token
        let UserId = jwt.verify(token, process.env.JWT_SECRET).UserId
        req.UserId = UserId;
        next()
    }
    catch (error) { res.json({ msg: "ERROR.Try logging in again." }) }
}

module.exports = auth












