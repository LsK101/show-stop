function getFavoritesAndPopulateManageFavoritesPage() {
	$.ajax({
		url: "api/faves/get",
		method: "POST",
		headers: {
			"content-type": "application/json",
			authorization: `Bearer ${authToken}`
		},
		data: JSON.stringify({userID: currentUserID})
	}).then(res => {
		favoriteArtists = res.favorites;
		listFavorites(favoriteArtists);
	})
}

function listFavorites(favoritesArray) {
	favoritesArray.forEach(favorite => {
		let favoriteArtistHTML = `
		<div class="favorite-artist-single-result">
			<button role="button" class="remove-favorite-button">Delete</button>
        	<span class="favorite-artist-name"><b>${favorite}</b></span><br>
      	</div>
  		`;
  		$('.manage-favorites-list-container').append(favoriteArtistHTML);
	});
}

function deleteFavoriteArtist() {
	$('.manage-favorites-container').on('click', '.remove-favorite-button', event => {
		const deleteQuery = $(event.currentTarget).closest('div').find('.favorite-artist-name').text();
		$.ajax({
			url: "api/faves/del",
			method: "POST",
			headers: {
				"content-type": "application/json",
				authorization: `Bearer ${authToken}`
			},
			data: JSON.stringify({userID: currentUserID, deleteArtist: deleteQuery})
		}).then(() => {
			reloadAndRenderFavorites();
		})
	});
}

function reloadAndRenderFavorites() {
	$('.manage-favorites-list-container').empty();
	getFavoritesAndPopulateManageFavoritesPage();
}

function returnToMainSearchPage() {
	$('.manage-favorites-container').on('click', '.return-button', event => {
			$.ajax({
			url: "/main",
			method: "GET",
			headers: {
				authorization: `Bearer ${authToken}`
			}
		}).then(res => {
			clearAndHideManageFavoritesContainer();
			populateAndUnhideMainContainer(res);
			getFavoritesFromServer(currentUserID);
		});
	})
}

function clearAndHideManageFavoritesContainer() {
	$('.manage-favorites-container').empty();
	$('.manage-favorites-container').prop('hidden', true);
}

function handleManageFavoritesLogoutButton() {
  $('.manage-favorites-container').on('click', '.logout-button', event => {
    getLoginSignupPageDataFromServer();
  });
}

deleteFavoriteArtist();
returnToMainSearchPage();
handleManageFavoritesLogoutButton();