// GENRE route handlers

var genre = require('../models/genre')

exports.genreList = function (req, res) {
  res.send('Display list of genres')
}
exports.genreDetail = function (req, res) {
  res.send('genre detail: ' + req.params.id)
}
exports.genreCreateGet = function (req, res) {
  res.send('genre create form')
}
exports.genreCreatePost = function (req, res) {
  res.send('genre create POST')
}
exports.genreDeleteGet = function (req, res) {
  res.send('genre delete form')
}
exports.genreDeletePost = function (req, res) {
  res.send('genre delete POST')
}
exports.genreUpdateGet = function (req, res) {
  res.send('genre update form')
}
exports.genreUpdatePost = function (req, res) {
  res.send('genre update POST')
}
