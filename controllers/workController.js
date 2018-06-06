// WORK route handlers

var Work = require('../models/work')

exports.workList = function (req, res, next) {
  Work.find({}, 'title year creator')
    .sort([['year', 'descending']])
    .exec(function (err, works) {
      if (err) { return next(err) }
      res.render('list_works', {
        title: 'List of Works',
        data: works
      })
    })
}

exports.workDetail = function (req, res) {
  res.send('work detail: ' + req.params.id)
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
