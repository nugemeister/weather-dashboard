// console.log('hello from file');

// Universal Variables

// Search Form Variables
var userCityInputEl = $("#userCityInput");
var userCitySearchButtonEl = $("#userCitySearchButton");
// PLACEHOLDER FOR STATE LIST EL (TBC)

// Weather Display Variables
var searchHistoryEl = $("#searchHistory");
var currentWeatherEl = $("#currentWeather");
var forecastWeatherEl = $("#forecastWeather");

// API Info
var apiKey = "ddaeddc476ffe0c412f2543004ba0f76";
var apiURL = "https://api.openweathermap.org/data/2.5/onecall";

// Historical Search Info
var searchHistoryList = [];

// Initial Page Load
// Pulling History from Local Storage
localStorage.getItem('search-history') {
    searchHistoryList = JSON.parse(localStorage.getItem('search-history'));
    console.log(searchHistoryList);
}
// Rendering History from Local Storage
searchHistoryEl.html(rendorHistory());
console.log(searchHistoryEl);

// Event Listener for Initial City Search
userCitySearchButtonEl.on("click", function(event) {
    event.preventDefault();
    // No blank searches allowed, prompt to ask user to populate city
    if (userCityInputEl.val() === "") {
        displayModal("Please enter a city to begin searching!");
        return;
    // } else {
    //     catch (error) {
    //         console.error(error);
    //     }
    // }
    }});



