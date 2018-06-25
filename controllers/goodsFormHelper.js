var async = require('async')
var mongoose = require('mongoose')
var ObjectId = mongoose.Types.ObjectId
var debug = require('debug')
var log = debug('prettygood:goodsFormHelper')

const Goods = require('../models/goods')
const Work = require('../models/work')
const Genre = require('../models/genre')

var genreIds = []
var workIds = {}

exports.genreStub = function (genreStr) {
  return genreStr.split(',').map(x => ObjectId())
}

exports.workStub = function (workStr) {
  var works = workStr.split('\n')
  var worksMap = {}
  for (var i = 1; i < works.length; i++) {
    worksMap[i] = ObjectId()
  }
  return worksMap
}

// returns genre list from form input string
exports.parseFormGenres = function (genreStr) {
  return genreStr.split(',').map(x => x.trim().toLowerCase()).filter(x => x)
}

// returns works map from form input string
exports.parseFormWorks = function (workStr, genreIds, mediatype) {
  log('modelWorks')
  var works = {}
  var workStars = workStr.split('*').map(x => x.trim()).filter(x => x)
  log('+ workStars: %o', workStars)
  for (var i = 0; i < workStars.length; i++) {
    var found = workStars[i].match(/^(.*)\(([^)]*)\)(.*)$/)
    var work = {
      title: found[1].trim(),
      year: found[2].trim(),
      creator: found[3].trim(),
      genre: genreIds,
      mediatype: mediatype
    }
    works[i + 1] = work
    log(' + regex found: %o', found)
  }
  return works
}

exports.createGenresTask = function (genres, callback) {
  log('createGenres')
  async.each(genres, function (genre, callback) {
    createGenre(genre, callback)
  },
  function (err) {
    if (err) return callback(err, null)
    callback(null, genreIds)
  })
}

exports.createWorksTask = function (works, callback) {
  log('createWorks')
  async.eachOf(works, function (work, index, callback) {
    createWork(index, work, callback)
  },
  function (err) {
    if (err) return callback(err, null)
    callback(null, workIds)
  })
}

exports.createGoodsTask = function (goods, callback) {
  log('createGoods')
  createGoods(goods, callback)
}

/************************************************************
 * LOCAL functions below                                    *
 ************************************************************/

function createGenre (name, callback) {
  var terms = {name: name}

  Genre.findOne(terms, function (err, found) {
    if (err) { return callback(err, null) }

    if (found) {
      genreIds.push(found._id)
      log('+ found genre: %o', found._id)
      return callback(null, found._id)
    }

    var id = new mongoose.Types.ObjectId()
    var genre = new Genre({_id: id, name: name})

    genre.save(function (err) {
      if (err) { return callback(err, null) }
      log('+ saved genre:', genre)
      genreIds.push(id)
      callback(null, id)
    })
  })
}

function createWork (rank, data, callback) {
  var terms = {
    title: data.title,
    creator: data.creator,
    year: data.year
  }

  Work.findOne(terms, function (err, found) {
    if (err) { return callback(err, null) }

    if (found) {
      workIds[rank] = found._id
      log('+ found work: %o', found._id)
      return callback(null, found._id)
    }

    var id = new mongoose.Types.ObjectId()
    data._id = id
    var work = new Work(data)

    work.save(function (err) {
      if (err) { return callback(err, null) }
      log('+ saved work: %o', work)
      workIds[rank] = id
      callback(null, id)
    })
  })
}

function createGoods (doc, callback) {
  var terms = {
    title: doc.title,
    source: doc.source,
    year: doc.year
  }

  Goods.findOne(terms, function (err, found) {
    if (err) { return callback(err, null) }

    if (found) {
      Goods.updateOne(terms, doc, function (err, res) {
        if (err) return callback(err, null)
        log('+ updated goods: %o', doc)
        return callback(null, JSON.stringify(res))
      })
      return // by the devil's hoofs!
    }

    var goods = new Goods(doc)
    goods.save(function (err) {
      if (err) { return callback(err, null) }
      log('+ saved goods: %o', goods)
      callback(null, goods._id)
    })
  })
}
