// GENRE route handlers

var async = require('async')
var Genre = require('../models/genre')
var Goods = require('../models/goods')
var Work = require('../models/work')

exports.genreList = function (req, res, next) {
  Genre.find({}, 'name')
    .sort([['name', 'ascending']])
    .exec(function (err, genres) {
      if (err) { return next(err) }
      res.render('list_genres', {
        title: 'Genres',
        data: genres
      })
    })
}

exports.genreDetail = function (req, res, next) {
  async.waterfall([
    function (callback) {
      Genre
        .find({name: req.params.name})
        .exec(function (err, genre) {
          if (err) { return next(err) }
          callback(null, genre[0])
        })
    },
    function (genre, callback) {
      Goods
        .find({genre: genre._id})
        .exec(function (err, goods) {
          if (err) { return next(err) }
          callback(null, genre, goods)
        })
    },
    function (genre, goods, callback) {
      Work
        .find({genre: genre._id})
        .exec(function (err, works) {
          if (err) { return next(err) }
          callback(null, {'genre': genre, 'goods': goods, 'works': works})
        })
    }
  ],
  function (err, results) {
    if (err) { return next(err) }
    res.render('detail_genre', {
      title: 'Genre detail',
      genre: results.genre,
      goods: results.goods,
      works: results.works
    })
  })
}
