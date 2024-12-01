const passport = require('passport')
const { campgroundSchema, reviewSchema } = require('./schema')
const ExpressError = require('./utilities/ExpressError')
const Campground = require('./models/campground')
const Review = require('./models/review')

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};



const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map((x) => {
            return x.message
        }).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
    // console.log(error);
}


const isAuthor = (async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
})


const isReviewAuthor = (async (req, res, next) => {
    const { idCamp, idReviews } = req.params
    const review = await Review.findById(idReviews)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/campgrounds/${idCamp}`)
    }
    next()
})


const validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map((x) => {
            return x.message
        }).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}


module.exports = { isLoggedIn, validateCampground, isAuthor, validateReview, isReviewAuthor, storeReturnTo }
