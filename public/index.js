let authToken;

function clearLoginSignupContainer() {
	$('.login-signup-container').empty();
}

function handleLoginForm() {
  $('.login-signup-container').submit($('.login-form'), event => {
    event.preventDefault();
    let inputUser = $('.login-username').val();
    let inputPass = $('.login-password').val();
    getAuthToken(inputUser, inputPass);
  });
}

function handleSignupForm() {
  $('.signup-form').submit(event => {
    event.preventDefault();
  });
}

function getAuthToken(inputUser, inputPass) {
	let encodedUserPass = btoa(inputUser + ":" + inputPass);
	$.ajax({
		url: "/api/auth/login",
		method: "POST",
		dataType: "json",
		headers: {
			"content-type": "application/json",
			authorization: `Basic ${encodedUserPass}`
		}
	}).then(res => {
		useAuthTokenToLogIn(res);
	});
}

function useAuthTokenToLogIn(authToken) {
	$.ajax({
		url: "/api/protected",
		method: "GET",
		headers: {
			authorization: `Bearer ${authToken.authToken}`
		}
	}).then(res => {
		clearLoginSignupContainer();
		$('.login-signup-container').prop('hidden', true);
		$('.main-container').append(res);
		$('.main-container').prop('hidden', false);
	});
}

handleLoginForm();
handleSignupForm();