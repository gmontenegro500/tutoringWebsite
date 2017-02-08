const express = require ('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

let User = require('../models/user');

router.post('/register', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let password2 = req.body.password2;

    // Validation

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();   
    req.checkBody('password2', 'Passwords do not match').equals(password);

    let errors = req.validationErrors();

    if (errors) {
        res.status(400).json(errors);
    } else {
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        User.createUser(newUser, (err, user) => {
            if (err) throw err;

            res.json(user);
        });
    }
});

router.put('/:id', (req, res) => {

    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.status(400).json(errors);
    } else {
        let newUser = {
            name: name,
            email: email,
            username: username
        };

        User.updateUser(req.params.id, newUser, (err, user) => {
            if (err) throw err;

            res.json(user);
        });
    }
});

router.put('/reset/:id', (req, res) => {

    let password = req.body.password;
    let password2 = req.body.password2;

    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(password);

    let errors = req.validationErrors();

    if (errors) {
        res.status(400).json(errors);
    } else {

        User.updatePassword(req.params.id, password, (err, user) => {
            if (err) throw err;

            res.json(user);

        });
    }
});

router.delete('/:id', (req, res) => {

    User.removeUser(req.params.id, (err, user) => {
        if (err) throw err;

        res.status(200).json(user);

    });

});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {

        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                error: info
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({
                    error: 'Could not log in user'
                });
            }

            res.status(200).json({
                msg: 'Login successful!'
            });
        });
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.status(200).json({
        msg: 'Logout successful!'
    });
});

router.get('/status', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(200).json({
            status: false
        });
    }

    res.status(200).json({
        status: true
    });
});

router.get('/info', User.isLoggedIn, (req, res) => {
    res.status(200).json({
        message: 'Todo bien!!'
    })
});

module.exports = router;