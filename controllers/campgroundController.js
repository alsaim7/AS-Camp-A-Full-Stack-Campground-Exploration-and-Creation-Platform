const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary')

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.maptilerApiKey;



module.exports.index = async (req, res) => {
    const camp = await Campground.find({})
    res.render('campgrounds/index', { camp })
}

module.exports.indexSearch = async (req, res) => {
    const searchQuery = req.query.q
    const results = await Campground.find({
        $or:[
            {title: { $regex: searchQuery, $options: 'i' }},
            {location: { $regex: searchQuery, $options: 'i' }}
        ]
    })
    res.render('campgrounds/search.ejs', { results, searchQuery })
    // res.send(results)
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new.ejs')
}

module.exports.createNewCamp = async (req, res) => {
    if (req.files.length > 7) {
        req.flash('error', 'You cannot upload more than 7 images.');
        return res.redirect('/campgrounds/new');
    }
    const data = req.body
    data.images = req.files.map((f) => {
        return {
            url: f.path,
            filename: f.filename
        }
    })
    const geoData = await maptilerClient.geocoding.forward(data.location, { limit: 1 });
    const camp = await new Campground(data)
    camp.geometry = geoData.features[0].geometry;
    camp.author = req.user._id
    await camp.save()
    req.flash('success', 'A new campground is created!')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.renderShowPage = async (req, res) => {
    const { id } = req.params
    const data = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!data) {
        req.flash('error', 'Campground Not Found!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { data })
}


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const data = await Campground.findById(id)
    if (!data) {
        req.flash('error', 'Campground Not Found!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { data })
}


module.exports.editCamp = async (req, res) => {
    const data = req.body
    const { id } = req.params
    const geoData = await maptilerClient.geocoding.forward(data.location, { limit: 1 });
    const camp = await Campground.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    camp.geometry = geoData.features[0].geometry;
    const imgs = req.files.map((f) => {
        return {
            url: f.path,
            filename: f.filename
        }
    })
    camp.images.push(...imgs)
    await camp.save()
    if (data.deleteImages) {
        for (let filename of data.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: data.deleteImages } } } })
    }
    req.flash('success', `${data.title} is updated!`)
    res.redirect(`/campgrounds/${id}`)
}


module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params
    const data = await Campground.findById(id)
    for (let img of data.images) {
        await cloudinary.uploader.destroy(img.filename)
    }
    const camp = await Campground.findByIdAndDelete(id)
    req.flash('success', `${camp.title} campground deleted!`)
    res.redirect(`/campgrounds`)
}

