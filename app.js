require('dotenv').config()

// node libraries
var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

// routes
var indexRouter = require('./routes/index')
var catalogRouter = require('./routes/catalog')

// Set up mongoose connection
var mongoose = require('mongoose')
var mongoDB = 'mongodb://localhost/prettygood'

mongoose.connect(mongoDB)
mongoose.Promise = global.Promise

var db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// app
var app = express()
app.locals.env = {...process.env}

// views/templates
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// middleware paths
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// routers
app.use('/', indexRouter)
app.use('/catalog', catalogRouter)

// handle 404
app.use(function (req, res, next) {
  next(createError(404))
})

// handle other errors
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
