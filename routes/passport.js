const debug = require('debug')('webpractica:passport:routes:passport:debug');
const error = require('debug')('webpractica:passport:routes:passport:error');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportConfig = require('../config/passport');
const User = require('../model/user');
const Cart = require('../model/cart');

router.post('/signin', function (req, res, next) {
    debug('Sign in')
    return passport.authenticate('local', { session: false },
        (err, user, info) => {
            debug('Authenticate');
            if (err || !user) {
                return res.status(400).json(err);
            }
            debug('Generating token');
            req.logIn(user, { session: false }, (err) => {
                if (err) { res.send(err); }
                var data = { id: user._id };
                const token = jwt.sign(data, passportConfig.secretKey, { expiresIn: 300 });
                //seconds
                return res.json({ token });
            });
        })(req, res);
});

router.post('/signup', function (req, res, next) {
    debug('Sign up');
    var user = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        surname: req.body.surname,
        birth: req.body.birth,
        address: req.body.address
    };
    debug('Sign up %O', user);
    return User.findOne({ email: user.email })
        .then((result) => {
            if (result)
                return res.status(400).json({
                    errors: { email: { message: 'Email already in use' } }
                })
            else {
                var cart = new Cart();
                cart.save()
                    .then(function (cart) {
                        user = new User(user);
                        user.password = user.encryptPassword(user.password);
                        user.cart = cart;
                        return user.save()
                    })
                    .catch((err) => res.status(400).json(err))
                    .then((user) => res.json(user))
                    .catch((err) => res.status(400).json(err));
            }
        })
});

router.get('/profile', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    return res.send(req.user);
});


// Routes
module.exports = router;
