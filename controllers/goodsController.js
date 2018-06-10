// GOODS route handlers

var Goods = require('../models/goods')
var Work = require('../models/work')
var Genre = require('../models/genre')

var async = require('async')
var mongoose = require('mongoose')

exports.index = function (req, res) {
  async.parallel({
    goodsCount: function (callback) { Goods.count({}, callback) },
    workCount: function (callback) { Work.count({}, callback) },
    genreCount: function (callback) { Genre.count({}, callback) }
  },
  function (err, results) {
    res.render('index', {
      title: 'Catalog',
      error: err,
      data: results
    })
  })
}

exports.goodsList = function (req, res, next) {
  Goods.find({}, 'title year source')
    .exec(function (err, goods) {
      if (err) { return next(err) }
      res.render('list_goods', {
        title: 'List of Goods',
        data: goods
      })
    })
}

exports.goodsDetail = function (req, res, next) {
  async.waterfall([
    function (callback) {
      Goods.findById(req.params.id)
        .populate('genre')
        .exec(function (err, goods) {
          if (err || !goods) {
            var notfound = new Error()
            notfound.status = 404
            notfound.message = 'Could not find the goods: ' + req.params.id
            return next(notfound)
          }
          callback(null, goods)
        })
    },
    function (goods, callback) {
      var ranks = JSON.parse(JSON.stringify(goods.works)) // FIXME
      var ids = Array
        .from(goods.works.values())
        .map(x => mongoose.Types.ObjectId(x))
      Work.find({_id: {$in: ids}}, '-genre -language')
        .exec(function (err, works) {
          if (err) { return next(err) }
          callback(null, {'goods': goods, 'works': works, 'ranks': ranks})
        })
    }
  ],
  function (err, result) {
    if (err) { return next(err) }

    // map works by _id to display in ranked order
    var worksMap = {}
    result.works.forEach(function (work) {
      worksMap[work._id] = work
    })

    res.render('detail_goods', {
      title: 'Goods Detail',
      goods: result.goods,
      genres: result.goods.genre.map(x => x.name),
      works: worksMap,
      ranks: result.ranks
    })
  })
}

exports.goodsCreateGet = function (req, res) {
  res.send('goods create form')
}
exports.goodsCreatePost = function (req, res) {
  res.send('goods create POST')
}
exports.goodsDeleteGet = function (req, res) {
  res.send('goods delete form')
}
exports.goodsDeletePost = function (req, res) {
  res.send('goods delete POST')
}
exports.goodsUpdateGet = function (req, res) {
  res.send('goods update form')
}
exports.goodsUpdatePost = function (req, res) {
  res.send('goods update POST')
}
