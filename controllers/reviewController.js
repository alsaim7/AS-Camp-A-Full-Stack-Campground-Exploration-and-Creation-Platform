const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
    const { idCamp } = req.params
    const reviewFormData = req.body
    const campData = await Campground.findById(idCamp)
    const reviewData = new Review(reviewFormData.review)
    reviewData.author = req.user._id
    campData.reviews.push(reviewData)
    const reviewDataSave = await reviewData.save()
    const campDataSave = await campData.save()
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${idCamp}`)
}


module.exports.deleteReview = async (req, res) => {
    const { idCamp, idReviews } = req.params
    await Campground.findByIdAndUpdate(idCamp, { $pull: { reviews: idReviews } })
    const deletedReview = await Review.findByIdAndDelete(idReviews)
    req.flash('success', `${deletedReview.body} review is deleted!`)
    res.redirect(`/campgrounds/${idCamp}`)
}