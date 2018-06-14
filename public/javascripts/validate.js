/**
 * https://getbootstrap.com/docs/4.1/components/forms/#validation
 * https://www.w3.org/TR/html5/sec-forms.html#statically-validating-the-constraints
 * https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation
 *
 * siznax 2018
 */

(function () {
  'use strict'

  var numbers = /^\d+$/

  function validateGenre () {
    var input = document.getElementById('genre')
    var genre = input.value
    if (genre.split(',').length > 3) {
      var err = 'Genre invalid: ' + genre
      console.log(err)
      input.setCustomValidity(err)
    } else {
      console.log('Genre okay: ' + genre)
      input.setCustomValidity('')
    }
  }

  function validateYear () {
    var input = document.getElementById('year')
    var year = input.value
    var max = (new Date()).getFullYear() + 1
    if (!numbers.test(year) || year > max) {
      var err = 'Year invalid: ' + year
      console.log(err)
      input.setCustomValidity(err)
    } else {
      console.log('Year okay: ' + year)
      input.setCustomValidity('')
    }
  }

  window.addEventListener('load', function () {
    document.getElementById('year').onchange = validateYear
    document.getElementById('genre').onchange = validateGenre

    var forms = document.getElementsByClassName('needs-validation')

    var validation = Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      }, false)
    })
  }, false)
})()
