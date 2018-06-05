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
var List = require('./models/list')

var genreIds = []
var workIds = {}

var listData = {
  'mediatype': 'book',
  'source': 'Google search',
  'url': 'https://www.google.com/search?q=top+classic+books',
  'title': 'Google Top Classic Books',
  'genre': ['Literature', 'Fiction', 'Classics'],
  'year': '2018',
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

    genre.save(function (err, callback) {
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
  //   function (cb) { createGenre(listData.genre[0], cb) },
  //   function (cb) { createGenre(listData.genre[1], cb) }
  // ], callback)

  async.each(listData.genre, function (genre, callback) {
    createGenre(genre, callback)
  },
  function (err) {
    if (err) return callback(err, null)
    callback(null, 'createGenres OK')
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
    data.mediatype = listData.mediatype
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
  //   function (cb) { createWork(1, listData.works['1'], cb) },
  //   function (cb) { createWork(2, listData.works['2'], cb) },
  //   function (cb) { createWork(3, listData.works['3'], cb) }
  // ], callback)

  async.eachOf(listData.works, function (work, index, callback) {
    createWork(index, work, callback)
  },
  function (err) {
    if (err) return callback(err, null)
    callback(null, 'createWorks OK')
  })
}

function createList (doc, callback) {
  var terms = {
    title: doc.title,
    source: doc.source,
    year: doc.year
  }

  List.findOne(terms, function (err, found) {
    if (err) { return callback(err, null) }

    if (found) {
      List.updateOne(terms, doc, function (err, res) {
        if (err) return callback(err, null)
        console.log('+ updated list:', doc)
        return callback(null, 'createList ' + JSON.stringify(res))
      })
      return // by the devil's hoofs!
    }

    var list = new List(doc)
    list.save(function (err) {
      if (err) { return callback(err, null) }
      console.log('+ saved list:', list)
      callback(null, list._id)
    })
  })
}

function createListTask (callback) {
  console.log('createList')
  var doc = listData
  doc.genre = genreIds
  doc.works = workIds
  createList(doc, callback)
}

var mongodb = 'mongodb://localhost/prettygood'
console.log('Connecting:', mongodb)
mongoose.connect(mongodb)
mongoose.Promise = global.Promise

var db = mongoose.connection

db.on('error', console.error.bind(console, 'Connection error:'))

db.once('open', function () {
  async.series([
    createGenresTask,
    createWorksTask,
    createListTask
  ],
  function (err, result) {
    if (err) console.log('ERRFIN: ', err)
    if (result) console.log(result)
    console.log('Done.')
    mongoose.disconnect()
  })
})
