const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

mongoose.connect('mongodb://192.168.81.222/mean-auth');

const db = mongoose.connection;

const app = express();
const User = require('./models/user');
const users = require('./api/users');
const videos = require('./api/videos');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

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

passport.use(new LocalStrategy((username, password, done) => {
    User.getUserByUsername(username, (err, user) => {

        if (err) throw err;

        if (!user) {
            return done(null, false, { message: 'Incorrect username..'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {

            if (err) throw err;

            if(isMatch)
                return done(null, user);
            else
                return done(null, false, { message: 'Incorrect password..'});
        });
    });
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, user) => {
        done(err, user);
    });
});

app.use('/user', users);
app.use('/video', videos);

app.listen(3002, () => {
    console.log('Server listen on port 3002');
})