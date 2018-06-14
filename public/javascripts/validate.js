// https://getbootstrap.com/docs/4.1/components/forms/#validation
// https://www.w3.org/TR/html5/sec-forms.html#statically-validating-the-constraints
// https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation

(function () {
  'use strict'

  var number = /^\d+$/

  function validateYear () {
    var input = document.getElementById('year')
    var year = input.value
    var max = (new Date()).getFullYear() + 1
    if (!number.test(year) || year > max) {
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
