const User = require('../models/user')


module.exports.renderRegisterForm = (req, res) => {
    res.render('user/register')
}

module.exports.registerUser = async (req, res) => {
    try {
        const registerFormData = req.body
        const user = new User({
            username: registerFormData.username,
            email: registerFormData.email
        })
        const registeredUser = await User.register(user, registerFormData.password)
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash('success', 'Welcome to YelpCamp')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('user/login')
}


module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
    res.redirect(redirectUrl);
}


module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash('success', 'Logged Out!')
        res.redirect('/campgrounds')
    })
}