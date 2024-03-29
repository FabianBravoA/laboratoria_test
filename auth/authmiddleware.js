const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).end();
    }

    const token = req.headers.authorization.split(' ')[1];

    return jwt.verify(token, "laboratoriaSecret", (err, decoded) => {
        if (err) { 
            return res.status(401).end(); 
        }

        const userId = decoded.sub;

        // check if a user exists
        return User.findById(userId, (userErr, user) => {
            if (userErr || !user) {
                return res.status(401).end();
            }

            req.user = user;

            return next();
        });
    });
};