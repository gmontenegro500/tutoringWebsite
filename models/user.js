const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

let UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    }
});
let User = mongoose.model('users', UserSchema);
User.createUser = (newUser, cb) => {
    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(cb);
        });
    });
};

module.exports = User;