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
var DateTime = luxon.DateTime;

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
pageLoad();

// Pulling History from Local Storage
// localStorage.getItem('search-history') {
//     searchHistoryList = JSON.parse(localStorage.getItem('search-history'));
//     console.log(searchHistoryList);
// }

// Rendering History from Local Storage
// searchHistoryEl.html(rendorHistory());
// console.log(searchHistoryEl);

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

// Event listener for pulling historical search data
searchHistoryEl.on("click", function(event) {
    if (event.target.matches(".btn")) {
        // Pulls geo location
        geoLocation = event.target.dataset.loc;
        // Pulls city text
        cityLocation = event.target.value;
        // Find the info in the weather history array
        var indexOfObject = searchHistoryList.findIndex(object => {
            return object.geo === geoLocation;
          });
        // Button clicked is removed from history list and then re-added to move it to top of the list
        searchHistoryList.splice(indexOfObject, 1);
        addCityToHistory();
        // Run the function to search for the geo coordinates
        generateCoordinates();
    }
});

// Master function to load the intial web page
function pageLoad() {
    // Add search history to the page
    showSearchHistory();
};

// Creating the historic search array / list
function addCityToHistory () {
    // Adding new item to list
    if (!searchHistoryList.some(e => e.geo === geoLocation)) {
        var historyItem = {
            geo: geoLocation
        };
    searchHistoryList.unshift(historyItem);
    // Setting param for history list length to 10
    if (searchHistoryList.length > 10) {
        searchHistoryList.length = 10;
    }
    // Store the history to local storage
    localStorage.setItem("searchHistoryList", JSON.stringify(searchHistoryList));
    // Print search history to page
    showSearchHistory();
    }
};

// Show the historic search results on home page
function showSearchHistory() {
    var storedCities = JSON.parse(localStorage.getItem("searchHistoryList"));
    if (storedCities !== null) {
        searchHistoryList = storedCities;
        searchHistoryEl.html("");
        // Show each historical record
        searchHistoryList.forEach(function (historyItem) {
            searchHistoryEl.append(`
            <div class="px-2 col-lg-8 my-2 col-4 col-md-3">
            <input class="btn btn-secondary col-10" type="button" data-loc="${historyItem.geo}" value="${historyItem.geo}">
            </div>
            `);
        })
    }
};

// Function to search for and return the coordinates of searched city using Geocoding API
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
            addCityToHistory();
            getWeatherData(data[0].lat, data[0].lon);
        }
        console.log(data);
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
    currentWeatherEl.addClass("border-light rounded border border-5 ");
    // Print to page
    currentWeatherEl.append(`
        <h2 class="text-center mb-md-8">${geoLocation} (${currentDate})</h2>
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
        <h3 class="text-center">5-Day Forecast:</h3>
        <div class="d-flex justify-content-evenly flex-wrap" id="forecastWeather">
    `);
    var forecastEl = $("#forecastWeather")
    for (var i = 1; i < 6; i++) {
        forecastEl.append(`
            <div class="bg-secondary col-md-4 col-8 m-0 p-2 text-center">
            <p class="fw-bold mt-1" style="line-height:.3">${DateTime.fromSeconds(daily[i].dt, {zone: timezone}).toFormat("EEEE")}</p>
            <p class="fw-bold" style="line-height:.3">${DateTime.fromSeconds(daily[i].dt, {zone: timezone}).toFormat("(M/d/yy)")}</p>
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