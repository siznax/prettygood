var express = require('express')
var router = express.Router()

var goodsController = require('../controllers/goodsController')
var workController = require('../controllers/workController')
var genreController = require('../controllers/genreController')

router.get('/', goodsController.index) // GET catalog home page.
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
router.get('/works', workController.worksList)

module.exports = router
