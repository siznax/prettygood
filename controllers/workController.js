var async = require('async')
var mongoose = require('mongoose')
var ObjectId = mongoose.Types.ObjectId

var Works = require('../models/work')
var Genres = require('../models/genre')

exports.worksList = function (req, res, next) {
  async.parallel({
    albums: function (cb) {Works.count({mediatype: 'albums'}, cb)},
    books: function (cb) {Works.count({mediatype: 'books'}, cb)},
    film: function (cb) {Works.count({mediatype: 'films'}, cb)}
  },
  function (err, results) {
    if (err) { return next(err) }
    res.render('list_works', {
      title: 'Works',
      total: results.albums + results.books + results.film,
      albums: results.albums,
      books: results.books,
      film: results.film
    })
  })
}

exports.worksMediatypeList = function (req, res, next) {
  var mediatype = req.params.mediatype
  if (!['albums', 'books', 'films'].includes(mediatype)) {
    var err = new Error('Unknown mediatype: ' + mediatype)
    err.status = 404
    next(err)
  }
  Works
    .find({mediatype: mediatype})
    .exec(function (err, results) {
      if (err) { return next(err) }
      res.render('list_media', {
        title: mediatype,
        total: results.length,
        works: results
      })
  })
}

exports.worksMediatypeGenreList = function (req, res, next) {
  var mediatype = req.params.mediatype
  var genre = req.params.genre
  if (!['albums', 'books', 'films'].includes(mediatype)) {
    var err = new Error('Unknown mediatype: ' + mediatype)
    err.status = 404
    next(err)
  }
  async.waterfall([
    function (callback) {
      Genres
        .find({name: genre})
        .exec(function (err, genres) {
          if (err) { return next(err) }
          callback(null, genres)
        })
    },
    function (genres, callback) {
      var gids = genres.map(x => ObjectId(x._id))
      Works
        .find({mediatype: mediatype, genre: { $all: gids }})
        .exec(function (err, works) {
          if (err) { return next(err) }
          callback(null, {'works': works, 'gids': gids})
        })
    }
  ],
  function (err, results) {
    if (err) { return next(err) }
    results.mediatype = mediatype
    results.genre = genre
    res.render('list_media', {
      title: [mediatype, genre].join('/'),
      total: results.works.length,
      works: results.works
    })
  })
}

exports.workDetail = function (req, res, next) {
  Works
    .findById(req.params.id)
    .exec(function (err, result) {
      if (err) { return next(err) }
      res.render('detail_work', {
        title: 'Work detail',
        work: result
      })
    })
}
