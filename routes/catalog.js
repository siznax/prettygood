var express = require('express')
var router = express.Router()

var listController = require('../controllers/listController')
var workController = require('../controllers/workController')
var genreController = require('../controllers/genreController')

// LIST routes

router.get('/', listController.index) // GET catalog home page.

router.get('/list/create', listController.listCreateGet)
router.post('/list/create', listController.listCreatePost)

// NOTE: /list/:id/delete,update pairs must come before /list/:id

router.get('/list/:id/delete', listController.listDeleteGet)
router.post('/list/:id/delete', listController.listDeletePost)

router.get('/list/:id/update', listController.listUpdateGet)
router.post('/list/:id/update', listController.listUpdatePost)

router.get('/list/:id', listController.listDetail)
router.get('/lists', listController.listList)

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
