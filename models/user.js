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

User.getUserByUsername = (username, cb) => {
    User.findOne({ username: username }, cb);
}

User.getUserById = (id, cb) => {
    User.findById(id, cb);
}

User.comparePassword = (candidatePassword, hash, cb) => {
    bcryptjs.compare(candidatePassword, hash, (err, isMatch) => {
        
        if (err) throw err;

        cb(null, isMatch);

    });
};

User.isLoggedIn = (req, res, next) => {

    if (req.isAuthenticated())
        return next();

    res.status(401).json({
        msg: 'Debes haber iniciado sesion'
    });
};

module.exports = User;