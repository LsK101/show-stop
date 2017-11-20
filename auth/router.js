const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config');

const createAuthToken = user => {
    return jwt.sign({user}, config.JWT_SECRET, {
        subject: user.username,
        expiresIn: config.JWT_EXPIRY,
        algorithm: 'HS256'
    });
};

const router = express.Router();

router.post('/login', (req, res, next) => {
    passport.authenticate('basic', function(err, user, info) {
        if (err) {next(err)}
        if (!user) {
            res.removeHeader('www-authenticate');
            return res.status(401).json({message: 'Incorrect username or password'})
        }
        else {
            const authToken = createAuthToken(user.apiRepr());
            return res.status(200).json({authToken});
        };
    })(req, res, next);
});

router.post(
    '/refresh',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const authToken = createAuthToken(req.user);
        res.json({authToken});
    }
);

module.exports = {router};