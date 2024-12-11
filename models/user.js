const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// userSchema.plugin(passportLocalMongoose)


userSchema.plugin(passportLocalMongoose, {
    passwordValidator: function (password, cb) {
        const minLength = 8
        const hasNumber = /\d/
        const hasUpperCase = /[A-Z]/
        const hasSpecialChar = /[@.$!%*?&#]/

        if (password.length < minLength) {
            return cb('Password must be at least 8 characters long');
        }
        if (!hasNumber.test(password)) {
            return cb('Password must contain at least one number');
        }
        if (!hasUpperCase.test(password)) {
            return cb('Password must contain at least one uppercase letter');
        }
        if (!hasSpecialChar.test(password)) {
            return cb('Password must contain at least one special character');
        }
        return cb(null);
    }
})


const User = mongoose.model('User', userSchema)

module.exports = User

