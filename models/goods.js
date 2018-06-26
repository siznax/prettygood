var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId

module.exports = mongoose.model('Goods', {
  description: {type: String, unique: true},
  genre: [{type: ObjectId, ref: 'Genre', required: true}],
  image: {type: String, unique: true},
  mediatype: {type: String},
  source: {type: String, required: true},
  title: {type: String, required: true},
  url: {type: String, unique: true},
  works: {type: Map, of: ObjectId, ref: 'Work', required: true},
  year: {type: String, required: true}
})
