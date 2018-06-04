// siznax 26 May 2018

var mongoose = require('mongoose')

module.exports = mongoose.model('Work', {
    creator: [{type: String, required: true}],
    genre: [{type: mongoose.Schema.Types.ObjectId, ref: 'Genre'}],
    language: {type: String, default: 'English'},
    mediatype: {type: String, enum: ['album', 'book', 'film'], required: true},
    title: {type: String, required: true},
    URL: String,
    year: {type: String, required: true},
})
