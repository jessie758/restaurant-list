const fbLoginForm = document.getElementById('fb-login-form');
const fbLoginBtn = document.getElementById('fb-login-btn');

fbLoginBtn.addEventListener('click', function onFacebookLogin() {
  console.log('trigger');
  fbLoginForm.submit();
});
