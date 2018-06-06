// GOODS route handlers

var Goods = require('../models/goods');
var Work = require('../models/work');
var Genre = require('../models/genre');

var async = require('async');

exports.index = function(req, res) {
  async.parallel({
    goodsCount: function (callback) { Goods.count({}, callback) },
    workCount: function (callback) { Work.count({}, callback) },
    genreCount: function (callback) { Genre.count({}, callback) }
  },
  function(err, results) {
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
  Goods.findById(req.params.id)
    .populate('genre')
    .exec(function (err, goods) {
      if (err) { return next(err) }
      res.render('detail_goods', {
        title: 'Goods Detail',
        goods: goods,
        genres: goods.genre.map(x => x.name),
        works: goods.works
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
