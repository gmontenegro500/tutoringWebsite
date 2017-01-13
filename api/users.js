const express = require ('express');
const router = express.Router();
let User = require('../models/user');    

router.post('/register', (req, res) => {
    let username = req.body.username;
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let password2 = req.body.password2;
    
    req.checkBody('name', 'El nombre es requerido').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();   
    req.checkBody('password2', 'Passwords do not match').equals(password);
    req.checkBody('password2', 'Passwords is required').notEmpty();
    
    let errors = req.validationErrors();
    if(errors){
        res.status(400).json(errors);
    }else{
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
module.exports = router;