// LIST route handlers

var list = require('../models/list')

exports.index = function (req, res) {
  res.send('Site home page')
}
exports.listList = function (req, res) {
  res.send('Display list of lists')
}
exports.listDetail = function (req, res) {
  res.send('list detail: ' + req.params.id)
}
exports.listCreateGet = function (req, res) {
  res.send('list create form')
}
exports.listCreatePost = function (req, res) {
  res.send('list create POST')
}
exports.listDeleteGet = function (req, res) {
  res.send('list delete form')
}
exports.listDeletePost = function (req, res) {
  res.send('list delete POST')
}
exports.listUpdateGet = function (req, res) {
  res.send('list update form')
}
exports.listUpdatePost = function (req, res) {
  res.send('list update POST')
}
