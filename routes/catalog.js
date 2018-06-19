var express = require('express')
var router = express.Router()

var adminController = require('../controllers/adminController')
var genreController = require('../controllers/genreController')
var goodsController = require('../controllers/goodsController')
var workController = require('../controllers/workController')

router.get('/', goodsController.index)
router.get('/admin', adminController.index)

router.get('/goods/create', goodsController.goodsCreateGet)
router.post('/goods/create', goodsController.goodsCreatePost)
router.get('/goods/:id/delete', goodsController.goodsDeleteGet)
router.post('/goods/:id/delete', goodsController.goodsDeletePost)
router.get('/goods/:id/update', goodsController.goodsUpdateGet)
router.post('/goods/:id/update', goodsController.goodsUpdatePost)
router.get('/goods/:id', goodsController.goodsDetail)
router.get('/goods', goodsController.goodsList)

router.get('/genre/:name', genreController.genreDetail)
router.get('/genres', genreController.genreList)

router.get('/work/:id', workController.workDetail)
router.get('/works/:mediatype', workController.worksMediatypeList)
router.get('/works/:mediatype/:genre', workController.worksMediatypeGenreList)
router.get('/works', workController.worksList)

module.exports = router
