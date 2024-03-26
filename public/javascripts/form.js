const form = document.getElementById('form');

// form validation
form.addEventListener('submit', function onFormSubmitted(event) {
  if (!form.checkValidity()) {
    event.stopPropagation();
    event.preventDefault();
    form.classList.add('was-validated');
  }
});

// form reset
form.addEventListener('reset', function onFormReset(_event) {
  form.classList.remove('was-validated');
});
