console.log('hello from file');

// Universal Variables

// Search Form Variables
var userCityInputEl = $("#userCityInput");
var userCitySearchButtonEl = $("#userCitySearchButton");
// PLACEHOLDER FOR STATE LIST EL (TBC)

// Weather Display Variables
var searchHistoryEl = $("#searchHistory");
var currentWeatherEl = $("#currentWeather");
var forecastWeatherEl = $("#forecastWeather");

// API Info for Current + Forecast Weather
var apiKey = "ddaeddc476ffe0c412f2543004ba0f76";
var apiWeatherURL = "https://api.openweathermap.org/data/2.5/onecall";

// API Info for Coordinate Search (uses same API key above)
var apiCoordinateURL = "https://api.openweathermap.org/geo/1.0/direct";

// Coordinate Search Variables
var geoLocation = "";

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
    } else {
        geoLocation = (userCityInputEl.val());
    }
    // Run the function to search for city coordinates
    generateCoordinates();
});

// Function to search for and return the geo coordinates of searched city
function generateCoordinates() {
    // Call Geocoding API for entered city and / or historical search entries
    fetch(`${apiCoordinateURL}?q=${geoLocation}&appid=${apiKey}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // Where no data, prompt the user to correct their input
        if(!data[0]) {
            displayModal("The city you've entered cannot be found, please check your entry.");
            return;
        // For a successful city search, save the city to local storage / history and send the coordinates to the getWeatherData function
        } else {
            addCityToHisory();
            getWeatherData(data[0].lat, data[0].lon);
        }
    })
};

// Use Coordinates to search for the weather at the selected city / cities (if history)
function getWeatherData(lat, lon) {
    // Call Weather API for the entered lat and lon value(s); reminder - these come from generateCoordinates function
    fetch(`${apiWeatherURL}?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`)
    .then(function (response) {
        return response.json();
    })
    // Send data to the print function in order to display the output of API call
    .then(function (data) {
        printWeatherData(data.current, data.daily, data.timezone);
    })
};

// Function to print weather data to the page
function printWeatherData(current, daily, timezone) {
    // Function to print current weather data to the page
    
    // Clear old info
    currentWeatherEl.html("");
    // Date info
    var currentDate = DateTime.fromSeconds(current.dt, {zone: timezone}).toFormat("EEE, M/d/y");
    // Weather description
    var currentWeatherDescription = current.weather[0].description;
    // Style output
    currentWeatherEl.addClass("border border-3 border-dark rounded");
    // Print to page
    currentWeatherEl.append(`
        <h2 class="text-center mb-0 mb-md-4">${geoLocation} (${currentDate})</h2>
        <h3 class="tex-center>Current Time: ${DateTime.fromSeconds(current.dt, {zone: timezone}).toFormat("h:mma")}</h3>
        <div class="row justify-content-center">
            <div class="col-auto">
            <img src="http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png">
            <p>${currentWeatherDescription}</p>
        </div>
    `);

    // Function to print forecast weather data to the page
    
    // Clear old info
    forecastWeatherEl.html("");
    // Print to page
    forecastWeatherEl.append(`
        <h3 class="text-center">Upcoming Weather Forecast:</h3>
        <div class="d-flex flex-wrap justify-content-evenly" id="forecastWeather">
    `);
    var forecastWeatherEl = $("#forecastWeather");
    for (var i = 1; i < 6; i++) {
        forecastWeatherEl.append(`
            <div class="bg-secondary col-12 col-md-2 p-2 m-1 text-center">
            <p class="fw-bold mt-2" style="line-height:.25">${DateTime.fromSeconds(daily[i].dt, {zone: timezone}).toFormat("EEEE")}</p>
            <p class="fw-bold" style="line-height:.25">${DateTime.fromSeconds(daily[i].dt, {zone: timezone}).toFormat("(M/d/yy)")}</p>
            <img src="http://openweathermap.org/img/wn/${daily[i].weather[0].icon}.png">
            <p>${(daily[i].weather[0].description).charAt(0).toUpperCase() + (daily[i].weather[0].description).slice(1)}</p>
            <p><span class="text-warning">Hi: ${Math.round(daily[i].temp.max)}°F</span>, <span class="text-info">Lo: ${Math.round(daily[i].temp.min)}°F</span></p>
            <p>Wind: ${windDirection(daily[i].wind_deg)} at ${Math.round(daily[i].wind_speed)}mph</p>
            <p>Humidity: ${daily[i].humidity}%</p>
        `)
    }
};

// Displays modal with alerts for user.
function displayModal(text) {
    $("#error").html(text);
    $('#myModal').modal("show");
};