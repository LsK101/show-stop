const passport = require('passport');
const {BasicStrategy} = require('passport-http');
const {
	Strategy: JwtStrategy,
	ExtractJwt
} = require('passport-jwt');

const {User} = require('../users/models');
const {JWT_SECRET} = require('../config');

const basicStrategy = new BasicStrategy((username, password, done) => {
    User.findOne({username: username}, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        user.validatePassword(password)
        .then(passedValidation => { 
            if(passedValidation) {
                return done(null, user)
            } 
            else {
                return done(null, false)
            }
        });
    });
})

const jwtStrategy = new JwtStrategy(
    {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        algorithms: ['HS256']
    },
    (payload, done) => {
        done(null, payload.user);
    }
);

module.exports = {basicStrategy, jwtStrategy};
