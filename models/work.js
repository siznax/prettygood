var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId

module.exports = mongoose.model('Work', {
  creator: [{type: String, required: true}],
  genre: [{type: ObjectId, ref: 'Genre'}],
  language: {type: String, default: 'English'},
  mediatype: {type: String, enum: ['album', 'book', 'film'], required: true},
  title: {type: String, required: true},
  URL: String,
  year: {type: String, required: true}
})
