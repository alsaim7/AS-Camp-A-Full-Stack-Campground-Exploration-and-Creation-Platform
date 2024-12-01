const express = require('express')
const Campground = require('../models/campground')
const cities = require('./cities')
// const descriptors= require('')
const { descriptors, places } = require('./seedHelpers')

const mongoose = require('mongoose');
const campground = require('../models/campground');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/as-camp')
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });

const nTitle = (list) => {
    const r = Math.floor(Math.random() * list.length)
    return list[r]
}

const seedDb = async () => {
    await Campground.deleteMany({})
    for (i = 0; i <= 300; i++) {
        const random = parseInt(Math.floor(Math.random() * 1001))
        // const randomName = Math.floor(Math.random() * places.length)
        const rate = Math.floor(Math.random() * (10000)) + 2000;
        const camp = new Campground({
            author: '674c32648a985cb5b3cb35dc',
            title: `${nTitle(descriptors)} ${nTitle(places)}`,
            location: `${cities[random].city}, ${cities[random].state}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[random].longitude, cities[random].latitude]
            },
            images: [
                {
                    url: "https://res.cloudinary.com/dnkqy2kkr/image/upload/v1732191651/campground/bkpzlcw8w0sdbtqxnoos.jpg",
                    filename: "campground/bkpzlcw8w0sdbtqxnoos"
                },
                {
                    url: "https://res.cloudinary.com/dnkqy2kkr/image/upload/v1732191652/campground/uak5pa1pac3xw6oj0nu7.jpg",
                    filename: "campground/uak5pa1pac3xw6oj0nu7"
                },
                {
                    url: "https://res.cloudinary.com/dnkqy2kkr/image/upload/v1732191655/campground/cg88oxjtrvz5lcjt70mz.jpg",
                    filename: "campground/cg88oxjtrvz5lcjt70mz"
                }
            ],
            price: rate,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        })
        await camp.save()
    }
    mongoose.connection.close()
}



seedDb()