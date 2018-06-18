var async = require('async')
var mongoose = require('mongoose')

const Goods = require('../models/goods')
const Work = require('../models/work')
const Genre = require('../models/genre')

exports.index = function (req, res) {
  async.parallel({
    goodsCount: function (callback) { Goods.count({}, callback) },
    workCount: function (callback) { Work.count({}, callback) },
    genreCount: function (callback) { Genre.count({}, callback) }
  },
  function (err, results) {
    res.render('admin', {
      title: 'Admin',
      data: results
    })
  })
}
