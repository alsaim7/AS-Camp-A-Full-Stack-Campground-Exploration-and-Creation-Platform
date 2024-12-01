const express = require('express')
const errorAsync = require('../utilities/errorAsync')
const ExpressError = require('../utilities/ExpressError')
const passport = require('passport')
const { storeReturnTo } = require('../middleware')
const userController = require('../controllers/userController')


const userRouter = express.Router()


userRouter.get('/register', userController.renderRegisterForm)
userRouter.post('/register', errorAsync(userController.registerUser))


userRouter.get('/login', userController.renderLoginForm)
userRouter.post('/login',
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    // Now we can use res.locals.returnTo to redirect the user after login
    userController.loginUser);


userRouter.get('/logout', userController.logoutUser)


module.exports = userRouter