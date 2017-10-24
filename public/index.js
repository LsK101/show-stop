let authToken;

function clearLoginSignupContainer() {
	$('.login-signup-container').empty();
}

function handleLoginForm() {
  $('.login-container').submit($('.login-form'), event => {
    event.preventDefault();
    let inputUser = $('.login-username').val();
    let inputPass = $('.login-password').val();
    getAuthToken(inputUser, inputPass);
  });
}

function handleSignupForm() {
  $('.signup-container').submit($('.signup-form'), event => {
    event.preventDefault();
    let newUser = $('.signup-username').val();
    let newPass = $('.signup-password').val();
    registerNewUser(newUser, newPass);
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
	}).then(JWT => {
		authToken = JWT.authToken
		useAuthTokenToLogIn(JWT.authToken);
	}).catch(() => {
		$('.login-error').empty();
		$('.login-error').append(`Incorrect username or password`);
	})
}

function useAuthTokenToLogIn(authToken) {
	$.ajax({
		url: "/main",
		method: "GET",
		headers: {
			authorization: `Bearer ${authToken}`
		}
	}).then(res => {
		clearLoginSignupContainer();
		$('.login-signup-container').prop('hidden', true);
		$('.main-container').append(res);
		$('.main-container').prop('hidden', false);
	});
}

function registerNewUser(user, pass) {
	$.ajax({
		url: "/api/users",
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		data: `{"username": "${user}", "password": "${pass}"}`
	}).then(res => {
		clearSignupForm();
		showUserCreationSuccess(res.username);
	}).catch(err => {
		userFailed = err.responseJSON.message;
		$('.user-created').empty();
		$('.user-created').append(userFailed);
	});
}

function clearSignupForm() {
	$('.signup-username').val("");
  	$('.signup-password').val("");
}

function showUserCreationSuccess(user) {
	userCreated = `New User ${user} successfully created!`
	$('.user-created').empty();
	$('.user-created').append(userCreated);
}

handleLoginForm();
handleSignupForm();