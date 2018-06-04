var mongoose = require('mongoose')

module.exports = mongoose.model('Genre', {
  name: {type: String, min: 3, max: 100, required: true, unique: true}
})
