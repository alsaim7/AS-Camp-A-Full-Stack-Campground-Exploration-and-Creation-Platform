const User = require('../models/user')


module.exports.renderRegisterForm = (req, res) => {
    res.render('user/register')
}

module.exports.registerUser = async (req, res) => {
    try {
        const registerFormData = req.body

        //confirm password back end validation
        if (registerFormData.password !== registerFormData.confirmPassword) {
            req.flash('error', 'Password do not match!')
            res.redirect('/register')
            return
        }
        //confirm password back end validation

        //username validations
        const noSpaces = /^\S+$/
        const noUpperCase = /^[a-z0-9._-]+$/;
        if (!noSpaces.test(registerFormData.username)) {
            req.flash('error', 'Username must not contain space.')
            res.redirect('/register')
            return
        }
        if (!noUpperCase.test(registerFormData.username)) {
            req.flash('error', 'Username can only contain lowercase letters, numbers and only the following symbols: underscore (_), dot (.), and hyphen (-).');
            res.redirect('/register')
            return
        }
        //username validations


        const user = new User({
            username: registerFormData.username,
            email: registerFormData.email
        })


        const registeredUser = await User.register(user, registerFormData.password)
        req.login(registeredUser, (err) => { //req.login is a function by passport 
            if (err) {
                return next(err)
            }
            req.flash('success', 'Welcome to YelpCamp')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        if (e.message && e.message !== 'E11000 duplicate key error collection: as-camp.users index: email_1 dup key: { email: "alsaimshakeel45@gmail.com" }') {
            req.flash('error', e.message)
            console.log(e);
            res.redirect('/register')
        }
        else if (e.message === 'E11000 duplicate key error collection: as-camp.users index: email_1 dup key: { email: "alsaimshakeel45@gmail.com" }') {
            req.flash('error', 'This e-mail id is already registered')
            console.log(e);
            res.redirect('/register')
        }
        else {
            req.flash('error', e)
            console.log(e);
            res.redirect('/register')
        }

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