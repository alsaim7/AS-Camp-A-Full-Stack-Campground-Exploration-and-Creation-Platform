const express = require('express')
const errorAsync = require('../utilities/errorAsync')
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')
const campgroundController = require('../controllers/campgroundController')
const multer = require('multer')
const { storage } = require('../cloudinary')



const upload = multer({ 
    storage,
    limits: {files: 7}
})


const campgroundsRouter = express.Router()


campgroundsRouter.get('/', errorAsync(campgroundController.index))


campgroundsRouter.get('/new', isLoggedIn, campgroundController.renderNewForm)
campgroundsRouter.post('/', isLoggedIn, upload.array('images', 7), validateCampground, errorAsync(campgroundController.createNewCamp))



campgroundsRouter.get('/:id', errorAsync(campgroundController.renderShowPage))


campgroundsRouter.get('/:id/edit', isLoggedIn, isAuthor, errorAsync(campgroundController.renderEditForm))
campgroundsRouter.put('/:id', isLoggedIn, isAuthor, upload.array('images', 7), validateCampground, errorAsync(campgroundController.editCamp))


campgroundsRouter.delete('/:id', isLoggedIn, isAuthor, errorAsync(campgroundController.deleteCamp))


module.exports = campgroundsRouter