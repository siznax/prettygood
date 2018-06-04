// siznax 26 May 2018

var mongoose = require('mongoose')

module.exports = mongoose.model('List', {
    genre: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true
    }],
    source: {type: String, required: true},
    description: {type: String},
    title: {type: String, required: true},
    URL: {type: String},
    works: {
      type: Map, of: mongoose.Schema.Types.ObjectId, ref: 'Work',
      required: true
    },
    year: {type: String, required: true},
})
