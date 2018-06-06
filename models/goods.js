var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId

module.exports = mongoose.model('Goods', {
  genre: [{type: ObjectId, ref: 'Genre', required: true}],
  source: {type: String, required: true},
  description: {type: String},
  title: {type: String, required: true},
  URL: {type: String},
  works: {type: Map, of: ObjectId, ref: 'Work', required: true},
  year: {type: String, required: true}
})
