function handleLoginForm() {
  $('.login-form').submit(event => {
    event.preventDefault();
  });
}

function handleSignupForm() {
  $('.signup-form').submit(event => {
    event.preventDefault();
  });
}

handleLoginForm();
handleSignupForm();