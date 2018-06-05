// WORK route handlers

var work = require('../models/work')

exports.workList = function (req, res) {
  res.send('Display list of works')
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
