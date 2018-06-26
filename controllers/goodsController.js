// GOODS route handlers

var async = require('async')
var mongoose = require('mongoose')
var helper = require('./goodsFormHelper.js')
var debug = require('debug')
var log = debug('prettygood:goodsController')

const {body, validationResult} = require('express-validator/check')
const {sanitizeBody} = require('express-validator/filter')

const Goods = require('../models/goods')
const Work = require('../models/work')

exports.index = function (req, res, next) {
  async.parallel({
    albums: function (cb) {Work.find({mediatype: 'albums'}, cb)},
    books: function (cb) {Work.find({mediatype: 'books'}, cb)},
    films: function (cb) {Work.find({mediatype: 'films'}, cb)}
  },
  function (err, results) {
    if (err) return next(err)
    res.render('index', {
      title: 'Catalog',
      albums: results.albums,
      books: results.books,
      films: results.films
    })
  })
}

exports.goodsList = function (req, res, next) {
  Goods.find({}, 'title year source')
    .exec(function (err, goods) {
      if (err) return next(err)
      res.render('list_goods', {
        title: 'Goods',
        total: goods.length,
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
            var notfound = new Error('Goods not found')
            notfound.status = 404
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
          if (err) return next(err)
          callback(null, {'goods': goods, 'works': works, 'ranks': ranks})
        })
    }
  ],
  function (err, result) {
    if (err) return next(err)

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

exports.goodsCreateGet = function (req, res, next) {
  res.render('create_goods', {
    title: 'New',
    validatejs: true
  })
}

exports.goodsCreatePost = [
  body('title')
    .trim().withMessage('Title is required.')
    .isLength({min: 2, max: 80}).withMessage('Title must be 2-80 characters.'),
  sanitizeBody('title').trim().escape(),

  body('source')
    .trim().withMessage('Source is required.')
    .isLength({min: 2, max: 32}).withMessage('Source must be 2-32 characters.'),
  sanitizeBody('source').trim().escape(),

  body('year')
    .trim().withMessage('Year is required.')
    .matches(/^\d+$/).withMessage('Year must be numeric.')
    .isLength({min: 1, max: 4}).withMessage('Year must be 1-4 digits.'),
  sanitizeBody('year').trim().escape(),

  body('genre')
    .trim().withMessage('Genre is required.')
    .isLength({min: 2, max: 80}).withMessage('Genre must be 2-80 characters.'),
  sanitizeBody('genre').trim().escape(),

  body('works')
    .trim().withMessage('Works is required.')
    .isLength({min: 5, max: 1024}).withMessage('Works must be 5-1024 characters.'),
  sanitizeBody('works').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req)

    var goods = new Goods({
      title: req.body.title,
      source: req.body.source,
      year: req.body.year,
      description: req.body.description,
      genre: req.body.genre,
      works: req.body.works
    })

    // render form again with validation errors
    if (!errors.isEmpty()) {
      res.render('create_goods', {goods: goods, errors: errors.array()})
      return
    }

    // SAVE goods: upsert genres, upsert works, save goods
    async.waterfall([
      function (callback) {
        log('goodsCreatePost: createGenres')
        var genres = helper.parseFormGenres(req.body.genre)
        log('+ genres: %o', genres)
        helper.createGenresTask(genres, function (err, genreIds) {
          if (err) return next(err)
          callback(null, genreIds)
        })
      },
      function (genreIds, callback) {
        log('goodsCreatePost: createWorks')
        var works = helper.parseFormWorks(req.body.works, genreIds,
          req.body.mediatype)
        log('+ works: %o', works)
        helper.createWorksTask(works, function (err, worksMap) {
          if (err) return next(err)
          callback(null, genreIds, worksMap)
        })
      },
      function (genreIds, worksMap, callback) {
        log('goodsCreatePost: createGoods')
        goods.genre = genreIds
        goods.works = worksMap
        log('+ goods: %o', goods)
        helper.createGoodsTask(goods, function (err, goodsId) {
          if (err) return next(err)
          callback(null, goodsId)
        })
      }
    ],
    function (err, goodsId) {
      if (err) return next(err)
      res.redirect('/catalog/goods/')
    })
  }
]

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
