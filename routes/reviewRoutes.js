const express = require('express')
const errorAsync = require('../utilities/errorAsync')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const reviewController= require('../controllers/reviewController')


const reviewsRouter = express.Router({ mergeParams: true })



reviewsRouter.post('/', isLoggedIn, validateReview, errorAsync(reviewController.createReview))


reviewsRouter.delete('/:idReviews', isLoggedIn, isReviewAuthor, errorAsync(reviewController.deleteReview))



module.exports = reviewsRouter