const mongoose = require('mongoose')
const Review = require('./review')
const { coordinates } = require('@maptiler/client')

const ImagesSchema = new mongoose.Schema({
  url: String,
  filename: String
})

ImagesSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_50')
})

const opts = { toJSON: { virtuals: true } };


const campgroundSchema = new mongoose.Schema({
  title: String,
  images: [ImagesSchema],
  price: Number,
  description: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  location: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
}, opts)


campgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>`
});



campgroundSchema.post('findOneAndDelete', async (doc) => {
  if (doc) {
    const res = await Review.deleteMany({ _id: { $in: doc.reviews } })
    // console.log(res);
  }
})

module.exports = mongoose.model('Campground', campgroundSchema)