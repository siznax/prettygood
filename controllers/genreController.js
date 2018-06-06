// GENRE route handlers

var async = require('async')
var Genre = require('../models/genre')
var Goods = require('../models/goods')

exports.genreList = function (req, res, next) {
  Genre.find({}, 'name')
    .sort([['name', 'ascending']])
    .exec(function (err, genres) {
      if (err) { return next(err) }
      res.render('list_genres', {
        title: 'List of Genres',
        data: genres
      })
    })
}

exports.genreDetail = function (req, res, next) {
  async.parallel({
    genre: function (callback) {
      Genre.findById(req.params.id).exec(callback)
    },
    genre_goods: function (callback) {
      Goods.find({'genre': req.params.id}).exec(callback)
    },
  }, function (err, results) {
    if (err) { return next(err) }
    if (results.genre == null) {
      var err = 'Genre not found'
      err.status = 404
      return next(err)
    }
    res.render('detail_genre', {
      title: 'Genre Details',
      genre: results.genre,
      genre_goods: results.genre_goods
    })
  })
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
