const User = require('../models/user');
const jwt = require('jsonwebtoken');


const authentication = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).send({ message: "authentication invalid" })
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(payload);
        next();
    } catch (error) {
        res.status(500).status({ message: error })
    }
}
module.exports = authentication;