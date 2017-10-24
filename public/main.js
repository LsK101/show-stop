const songkickSearchAPI = "https://api.songkick.com/api/3.0/search/artists.json";

let searchCounter = 0;

/* SEARCH FORM FUNCTIONALITY */
function handleSearchForm() {
  $('.main-container').submit($('.search-form'), event => {
    event.preventDefault();
    const artistQuery = $('.artist-string').val();
    clearInputFields();
    clearAndHideResultsContainers();
    preventSearchHistoryOverflow();
    addSearchHistoryEntry(artistQuery);
    getSongkickArtistID(artistQuery, getSongkickArtistDetails);
    unhideContainers();
  });
}

/* CONTAINER AND INPUT FIELD BEHAVIORS PER SUBMISSION */
function unhideContainers() {
  $('.hidden').prop('hidden', false);
}

function clearInputFields() {
  $('.artist-string').val("");
  $('.song-string').val("");
}

function clearAndHideResultsContainers() {
  $('.container').empty();
  $('.container').prop('hidden', true);
}

/* LOGOUT FUNCTIONALITY */
  $('.main-container').on('click', '.logout-button', event => {
    getLoginSignupPageDataFromServer();
  });

function getLoginSignupPageDataFromServer() {
  $.ajax({
    url: "/logout",
    method: "GET"
  }).then(res => {
    clearAndHideMainContainer();
    clearAuthTokenAndCurrentUser();
    resetSearchCounters();
    populateAndUnhideLoginSignupContainer(res);
    handleLoginForm(); //FROM INDEX.JS
    handleSignupForm(); //FROM INDEX.JS
  });
}

function clearAndHideMainContainer () {
  $('.main-container').empty();
  $('.main-container').prop('hidden', true);
}

function clearAuthTokenAndCurrentUser() {
  authToken = "";
  currentUser = "";
}

function resetSearchCounters() {
  searchCounter = 0;
  similarArtistsSearchCounter = 0;
}

function populateAndUnhideLoginSignupContainer(HTML) {
  $('.login-signup-container').append(HTML);
  $('.login-signup-container').prop('hidden', false);
}

/* SEARCH HISTORY FUNCTIONALITY */
function preventSearchHistoryOverflow() {
  searchCounter++;
  if (searchCounter > 3) {
    $('.search-history').find('.search-history-entry:first').remove();
  }
}

function addSearchHistoryEntry(artistQuery) {
  $('.search-history').append(`
      <div class="search-history-entry">
        <span class="search-history-artist"><b>${artistQuery}</b></span><br>
        <img src="./images/search-logo.png" class="history-search-logo">
      </div>
      `);
}

function handleSearchUsingSearchHistory() {
  $('.main-container').on('click', '.history-search-logo', event => {
      const artistQuery = $(event.currentTarget).closest('div').find('.search-history-artist').text();
      clearInputFields();
      clearAndHideResultsContainers();
      getSongkickArtistID(artistQuery, getSongkickArtistDetails);
      unhideContainers();
  });
}

/* SONGKICK API FUNCTIONALITY */
function getSongkickArtistID(artistQuery, callback) {
  const query = {
    query: artistQuery,
    apikey: 'mtLUgpC0c49wQgiQ'
  };
  $.getJSON(songkickSearchAPI, query, callback);
}

function getSongkickArtistDetails(songkickAPIData) {
  const artistID = songkickAPIData.resultsPage.results.artist[0].id;
  const artistURL = songkickAPIData.resultsPage.results.artist[0].uri;
  const artistName = songkickAPIData.resultsPage.results.artist[0].displayName;
  displayArtistEventHeaderAndSongkickLink(artistURL, artistName);
  getSongkickArtistEventData(artistID, displaySongkickEventData);
  getSongkickSimilarArtistsData(artistID, displaySongkickSimilarArtistsData);
}

function displayArtistEventHeaderAndSongkickLink(artistURL, artistName) {
  $('.shows').append(`
      <span role="heading" class="section-header">Upcoming Live Performances</span>
      <a href="http://www.songkick.com/" target="_blank">
      <img src="./images/by-songkick-white.png" class="songkick-logo">
      </a>
      <br>
      <br>
      <div class="shows-single-result">
      <span><b>${artistName}</b></span><br>
        <a href="${artistURL}" target="_blank">
          <img src="./images/sk-badge-white.png" class="similar-songkick-logo">
        </a>
      </div>
      `);
}

function getSongkickArtistEventData(artistID, callback) {
  const songkickEventAPI = `https://api.songkick.com/api/3.0/artists/${artistID}/calendar.json`;
  const query = {
    per_page: 5,
    apikey: 'mtLUgpC0c49wQgiQ'
  };
  $.getJSON(songkickEventAPI, query, callback);
}

function displaySongkickEventData(songkickAPIData) {
  if (songkickAPIData.resultsPage.totalEntries === 0) {
    $('.shows').append(`
      <div class="shows-single-result">
        <span>No Scheduled Live Performances</span>
      </div>
      `);
  }
  else {
    const resultsData = songkickAPIData.resultsPage.results.event.map((item) => renderSongkickEventData(item));
    $('.shows').append(resultsData); 
  }
}

function renderSongkickEventData(item) {
  return `
      <div class="shows-single-result">
        <span><b>Date:</b> ${item.start.date}</span><br>
        <span><b>Location:</b> ${item.location.city}</span><br>
        <span><b>Event:</b></span><br>
        <a href="${item.uri} target="_blank">
          <span>${item.displayName}</span><br>
        </a>
        <span><b>Venue:</b></span><br>
        <a href="${item.venue.uri} target="_blank">
          <span>${item.venue.displayName}</span><br>
        </a>
      </div>
  `;
}

function getSongkickSimilarArtistsData(artistID, callback) {
  const songkickSimilarArtistsAPI = `https://api.songkick.com/api/3.0/artists/${artistID}/similar_artists.json`;
  const query = {
    per_page: 5,
    apikey: 'mtLUgpC0c49wQgiQ'
  };
  $.getJSON(songkickSimilarArtistsAPI, query, callback);
}

function displaySongkickSimilarArtistsData(songkickAPIData) {
  const resultsData = songkickAPIData.resultsPage.results.artist.map((item) => renderSongkickSimilarArtistsData(item));
  $('.similar-artists').append(`
    <span role="heading" class="section-header">Similar Artists</span>
    <a href="http://www.songkick.com/" target="_blank">
    <img src="./images/by-songkick-white.png" class="songkick-logo">
    </a>
    <br>
    <br>
    `);
  $('.similar-artists').append(resultsData);
}

function renderSongkickSimilarArtistsData(item) {
  return `
      <div class="similar-artists-single-result">
        <span class="similar-artist-name"><b>${item.displayName}</b></span><br>
        <img src="./images/search-logo.png" class="similar-search-logo">
        <a href="${item.uri}" target="_blank">
          <img src="./images/sk-badge-white.png" class="similar-songkick-logo">
        </a>
      </div>
  `;
}

function handleSearchUsingSimilarArtist() {
  $('.main-container').on('click', '.similar-search-logo', event => {
      const artistQuery = $(event.currentTarget).closest('div').find('.similar-artist-name').text();
      clearInputFields();
      clearAndHideResultsContainers();
      getSongkickArtistID(artistQuery, getSongkickArtistDetails);
      unhideContainers();
  });
}

/* EXECUTE ALL FUNCTION CALLS */
handleSearchForm();
handleSearchUsingSearchHistory();
handleSearchUsingSimilarArtist();