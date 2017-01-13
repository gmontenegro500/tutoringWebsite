const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/meandb');

const app = express();
const users = require('./api/users');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'estoesunapalabradepruebaparaeltuto',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        let namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length) {
            formParam += `[${namespace.shift()}]`;
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use('/user', users);

app.listen(3000, () => {
   console.log('Server listen on port 3000');
});