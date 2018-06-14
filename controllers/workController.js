// WORK route handlers

var async = require('async')
var Works = require('../models/work')

exports.workList = function (req, res, next) {
  async.parallel({
    albums: function (callback) {
      Works.find({mediatype: 'albums'}).exec(callback)
    },
    books: function (callback) {
      Works.find({mediatype: 'books'}).exec(callback)
    },
    film: function (callback) {
      Works.find({mediatype: 'film'}).exec(callback)
    }
  },
  function (err, results) {
    if (err) { return next(err) }
    res.render('list_works', {
      title: 'Works',
      data: results
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
exports.workCreateGet = function (req, res) {
  res.send('work create form')
}
exports.workCreatePost = function (req, res) {
  res.send('work create POST')
}
exports.workDeleteGet = function (req, res) {
  res.send('work delete form')
}
exports.workDeletePost = function (req, res) {
  res.send('work delete POST')
}
exports.workUpdateGet = function (req, res) {
  res.send('work update form')
}
exports.workUpdatePost = function (req, res) {
  res.send('work update POST')
}
