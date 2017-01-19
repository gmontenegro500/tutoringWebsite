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

let User = mongoose.model('User', UserSchema);

User.createUser = (newUser, cb) => {
    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(cb);
        });
    });
};

User.updateUser = (id, newUser, cb) => {
    User.findByIdAndUpdate(id, { $set: newUser }, { new: true }, cb);
};

User.updatePassword = (id, password, cb) => {
    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(password, salt, (err, hash) => {
            password = hash;
            User.findByIdAndUpdate(id, { $set: { password: password } }, { new: true }, cb);
        });
    });
};

User.removeUser = (id, cb) => {
    User.findByIdAndRemove(id, cb);
};

module.exports = User;