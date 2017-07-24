const jwt = require('jsonwebtoken');
const User = require('../models/user');
const PassportLocalStrategy = require('passport-local').Strategy;

module.exports = new PassportLocalStrategy({
    usernameField       : 'email',
    passwordField       : 'password',
    session             : false,
    passReqToCallback   : true
}, (req, email, password, done) => {
    const userData = {
        email: email.trim(),
        password: password.trim()
    };

    User.findOne(
        { 
            email: userData.email 
        }
    ).then(function(user){
        if(!user){
            const error = new Error('Incorrect email or password');
            error.name = 'IncorrectCredentialsError';

            throw error;
        }

        user.comparePassword(userData.password, (passwordErr, isMatch) => {
            if (passwordErr) { 
                return done(passwordErr); 
            }

            if (!isMatch) {
                const error = new Error('Incorrect email or password');
                error.name = 'IncorrectCredentialsError';
                return done(error);
            }

            const payload = {
                sub: user._id
            };

            // create a token string
            const token = jwt.sign(payload, "laboratoriaSecret");
            const data = {
                name: user.name
            };

            return done(null, token, data);
        });
    }).catch(function(error){
        console.log("Error in signin method > "+error)
        return done(error);
    });
});