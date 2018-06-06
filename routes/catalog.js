var express = require('express')
var router = express.Router()

var goodsController = require('../controllers/goodsController')
var workController = require('../controllers/workController')
var genreController = require('../controllers/genreController')

// GOODS routes

router.get('/', goodsController.index) // GET catalog home page.

router.get('/goods/create', goodsController.goodsCreateGet)
router.post('/goods/create', goodsController.goodsCreatePost)

// NOTE: /goods/:id/delete,update pairs must come before /goods/:id

router.get('/goods/:id/delete', goodsController.goodsDeleteGet)
router.post('/goods/:id/delete', goodsController.goodsDeletePost)

router.get('/goods/:id/update', goodsController.goodsUpdateGet)
router.post('/goods/:id/update', goodsController.goodsUpdatePost)

router.get('/goods/:id', goodsController.goodsDetail)
router.get('/goods', goodsController.goodsList)

// WORK routes

router.get('/work/create', workController.workCreateGet)
router.post('/work/create', workController.workCreatePost)

// NOTE: /work/:id/delete,update pairs must come before /work/:id

router.get('/work/:id/delete', workController.workDeleteGet)
router.post('/work/:id/delete', workController.workDeletePost)

router.get('/work/:id/update', workController.workUpdateGet)
router.post('/work/:id/update', workController.workUpdatePost)

router.get('/work/:id', workController.workDetail)
router.get('/works', workController.workList)

// GENRE routes

router.get('/genre/create', genreController.genreCreateGet)
router.post('/genre/create', genreController.genreCreatePost)

// NOTE: /genre/:id/delete,update pairs must come before /genre/:id

router.get('/genre/:id/delete', genreController.genreDeleteGet)
router.post('/genre/:id/delete', genreController.genreDeletePost)

router.get('/genre/:id/update', genreController.genreUpdateGet)
router.post('/genre/:id/update', genreController.genreUpdatePost)

router.get('/genre/:id', genreController.genreDetail)
router.get('/genres', genreController.genreList)

module.exports = router
