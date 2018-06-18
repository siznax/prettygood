(function () {
  'use strict'

  $('#nav-albums').on('click', function () {
    if ($(this).hasClass('active')) {
      window.location.href = '/catalog'
    } else {
      window.location.href = '/catalog/works/albums'
    }
  })

  $('#nav-books').on('click', function () {
    if ($(this).hasClass('active')) {
      window.location.href = '/catalog'
    } else {
      window.location.href = '/catalog/works/books'
    }
  })

  $('#nav-films').on('click', function () {
    if ($(this).hasClass('active')) {
      window.location.href = '/catalog'
    } else {
      window.location.href = '/catalog/works/films'
    }
  })

  window.addEventListener('load', function () {
    var path = window.location.pathname
    console.log(path)
    if (path == '/catalog/works/albums') {
      $('#nav-albums').addClass('active')
      $('#nav-books').removeClass('active')
      $('#nav-films').removeClass('active')
    } else if (path == '/catalog/works/books') {
      $('#nav-albums').removeClass('active')
      $('#nav-books').addClass('active')
      $('#nav-films').removeClass('active')
    } else if (path == '/catalog/works/films') {
      $('#nav-albums').removeClass('active')
      $('#nav-books').removeClass('active')
      $('#nav-films').addClass('active')
    } else {
      $('#nav-albums').removeClass('active')
      $('#nav-books').removeClass('active')
      $('#nav-films').removeClass('active')
    }
  }, false)
})()
