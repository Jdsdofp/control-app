// passport.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const user = await User.findOne({ email });

                if (!user) {
                    return done(null, false, { message: 'Email ou senha incorretos' });
                }

                const isMatch = await bcrypt.compare(password, user.password);

                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Email ou senha incorretos' });
                }
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err);
            });
    });
};
