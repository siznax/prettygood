var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId

module.exports = mongoose.model('Work', {
  creator: [{type: String, required: true}],
  description: {type: String, unique: true},
  genre: [{type: ObjectId, ref: 'Genre'}],
  language: {type: String, default: 'en'},
  mediatype: {type: String, enum: ['albums', 'books', 'films'], required: true},
  title: {type: String, required: true},
  url: {type: String, unique: true},
  year: {type: String, required: true}
})
