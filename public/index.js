let authToken;
let currentUser;

function clearLoginSignupContainer() {
	$('.login-signup-container').empty();
}

function handleLoginForm() {
  $('.login-container').submit($('.login-form'), event => {
    event.preventDefault();
    let inputUser = $('.login-username').val();
    let inputPass = $('.login-password').val();
    setCurrentUser(inputUser);
    clearLoginForm();
    getAuthToken(inputUser, inputPass);
  });
}

function handleSignupForm() {
  $('.signup-container').submit($('.signup-form'), event => {
    event.preventDefault();
    let newUser = $('.signup-username').val();
    let newPass = $('.signup-password').val();
    let confirmPass = $('.confirm-password').val();
    if (newPass === confirmPass) {
    	registerNewUser(newUser, newPass);
    }
    else {
    	let errorMessage = `passwords do not match`
   		clearErrorAndSuccessMessages();
		$('.signup-error').append(errorMessage);
    }
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
		clearErrorAndSuccessMessages();
		$('.login-error').append(`incorrect username or password`);
	});
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
		clearErrorAndSuccessMessages();
		let userCreated = `"${user}" successfully created!`
		$('.user-created').append(userCreated);
	}).catch(err => {
		let errorLocation = err.responseJSON.location;
		let errorMessage = err.responseJSON.message.toLowerCase();
		let errorConcatenated = (`${errorLocation} ${errorMessage}`);
		clearErrorAndSuccessMessages();
		$('.signup-error').append(errorConcatenated);
	});
}

function setCurrentUser(inputUser) {
	currentUser = inputUser;
}

function clearLoginForm() {
	$('.login-username').val("");
  	$('.login-password').val("");
}

function clearSignupForm() {
	$('.signup-username').val("");
  	$('.signup-password').val("");
  	$('.confirm-password').val("");
}

function clearErrorAndSuccessMessages() {
	$('.signup-error').empty();
	$('.user-created').empty();
	$('.login-error').empty();
}

handleLoginForm();
handleSignupForm();