var async = require('async')
var Works = require('../models/work')

exports.worksList = function (req, res, next) {
  async.parallel({
    albums: function (cb) {Works.count({mediatype: 'albums'}, cb)},
    books: function (cb) {Works.count({mediatype: 'books'}, cb)},
    film: function (cb) {Works.count({mediatype: 'film'}, cb)}
  },
  function (err, results) {
    if (err) { return next(err) }
    res.render('list_works', {
      title: 'Works',
      albums: results.albums,
      books: results.books,
      film: results.film
    })
  })
}

exports.worksMediatypeList = function (req, res, next) {
  var mediatype = req.params.mediatype
  if (['albums', 'books', 'film'].includes(mediatype)) {
    Works
      .find({mediatype: mediatype})
      .exec(function (err, results) {
        if (err) { return next(err) }
        res.render('list_media', {
          title: 'Works: ' + mediatype,
          data: results
        })
      })
  } else {
    var err = new Error('Unknown mediatype: ' + mediatype)
    err.status = 404
    next(err)
  }
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
