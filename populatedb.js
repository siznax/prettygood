/**
 * Populate database, test models
 *
 * @author siznax
 *
 * Based on "populatedb.js" from Express/Node/Mongoose MDN tutorial
 * https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
 */

var async = require('async')
var mongoose = require('mongoose')

var Genre = require('./models/genre')
var Work = require('./models/work')
var Goods = require('./models/goods')

var genreIds = []
var workIds = {}

var goodsData = {
  'mediatype': 'books',
  'description': 'Classic books ranked by Google',
  'url': 'https://www.google.com/search?q=top+classic+books',
  'source': 'Google Search',
  'year': '2018',
  'title': 'Google Top Classic Books',
  'genre': ['literature', 'fiction', 'classics'],
  'works': {
    1: {
      'title': 'Nineteen Eighty-Four',
      'year': '1949',
      'creator': ['George Orwell']
    },
    2: {
      'title': 'To Kill A Mockingbird',
      'year': '1960',
      'creator': ['Harper Lee']
    },
    3: {
      'title': 'Pride and Prejudice',
      'year': '1813',
      'creator': ['Jane Austen']
    },
    4: {
      'title': 'The Great Gatsby',
      'year': '1925',
      'creator': ['F. Scott Fitzgerald']
    },
    5: {
      'title': 'Wuthering Heights',
      'year': '1847',
      'creator': ['Emily Brontë']
    }
  }
}

function createGenre (name, callback) {
  var terms = {name: name}

  Genre.findOne(terms, function (err, found) {
    if (err) { return callback(err, null) }

    if (found) {
      genreIds.push(found._id)
      console.log('+ found genre:', found._id)
      return callback(null, found._id)
    }

    var id = new mongoose.Types.ObjectId()
    var genre = new Genre({_id: id, name: name})

    genre.save(function (err) {
      if (err) { return callback(err, null) }
      console.log('+ saved genre:', genre)
      genreIds.push(id)
      callback(null, id)
    })
  })
}

function createGenresTask (callback) {
  console.log('createGenres')

  // async.parallel([
  //   function (cb) { createGenre(goodsData.genre[0], cb) },
  //   function (cb) { createGenre(goodsData.genre[1], cb) }
  // ], callback)

  async.each(goodsData.genre, function (genre, callback) {
    createGenre(genre, callback)
  },
  function (err) {
    if (err) return callback(err, null)
    callback(null, genreIds)
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
      console.log('+ found work: ', found._id)
      return callback(null, found._id)
    }

    var id = new mongoose.Types.ObjectId()
    data._id = id
    data.mediatype = goodsData.mediatype
    data.genre = genreIds
    var work = new Work(data)

    work.save(function (err) {
      if (err) { return callback(err, null) }
      console.log('+ saved work:', work)
      workIds[rank] = id
      callback(null, id)
    })
  })
}

function createWorksTask (callback) {
  console.log('createWorks')

  // async.parallel([
  //   function (cb) { createWork(1, goodsData.works['1'], cb) },
  //   function (cb) { createWork(2, goodsData.works['2'], cb) },
  //   function (cb) { createWork(3, goodsData.works['3'], cb) }
  // ], callback)

  async.eachOf(goodsData.works, function (work, index, callback) {
    createWork(index, work, callback)
  },
  function (err) {
    if (err) return callback(err, null)
    callback(null, workIds)
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
        console.log('+ updated goods:', doc)
        return callback(null, JSON.stringify(res))
      })
      return // by the devil's hoofs!
    }

    var goods = new Goods(doc)
    goods.save(function (err) {
      if (err) { return callback(err, null) }
      console.log('+ saved goods:', goods)
      callback(null, goods._id)
    })
  })
}

function createGoodsTask (callback) {
  console.log('createGoods')
  goodsData.genre = genreIds
  goodsData.works = workIds
  createGoods(goodsData, callback)
}

var mongodb = 'mongodb://localhost/prettygood'
console.log('Connecting:', mongodb)
mongoose.connect(mongodb)
mongoose.Promise = global.Promise

var db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB Connection Error:'))

db.once('open', function () {
  async.series([
    createGenresTask,
    createWorksTask,
    createGoodsTask
  ],
  function (err, result) {
    if (err) console.log('Final Error: ', err)
    if (result) console.log('Final result:', result)
    console.log('Done.')
    mongoose.disconnect()
  })
})
