var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId

module.exports = mongoose.model('Goods', {
  description: String,
  genre: [{type: ObjectId, ref: 'Genre', required: true}],
  image: String,
  mediatype: {type: String, required: true},
  source: {type: String, required: true},
  title: {type: String, required: true},
  url: String,
  works: {type: Map, of: ObjectId, ref: 'Work', required: true},
  year: {type: String, required: true}
})
