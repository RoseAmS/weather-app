//Showing actual date and time - based on current location

function formatDate(now) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let date = now.getDate();

  let hour = now.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day}, ${month} ${date} ${hour}:${minutes}`;
}

let dateTime = document.querySelector("#date-time");
let now = new Date();

dateTime.innerHTML = formatDate(now);

//Showing city to be searched

function searchCity(city) {
  let apiKey = "34c983dcfcb96cce74bfa8ccc56e5ffe";
  let units = "metric";
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather";
  let apiCall = `${apiUrl}?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiCall).then(showWeather);
}

function searchSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city").value;
  searchCity(city);
}

let searchForm = document.querySelector("#city-form");
searchForm.addEventListener("submit", searchSubmit);

//Display temperature based on search or current location

function showWeather(response) {
  let city = response.data.name;
  let country = response.data.sys.country;
  document.querySelector("h2").innerHTML = `${city}, ${country}`;

  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );

  document.querySelector("#feels-like").innerHTML = Math.round(
    response.data.main.feels_like
  );

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;

  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  document.querySelector("h3").innerHTML = response.data.weather[0].main;
}

//Functions to convert temperatures

function showFahrenheit(event) {
  event.preventDefault();

  document.querySelector("#temperature").innerHTML = Math.round(
    (Number(temperature) * 9) / 5 + 32
  );

  document.querySelector("#feels-like").innerHTML = Math.round(
    (Number(feelsLike) * 9) / 5 + 32
  );
}

let fahrenheit = document.querySelector("a#fahrenheit");
fahrenheit.addEventListener("click", showFahrenheit);

// function showCelsius(event) {
//   event.preventDefault();
//   let temperature = document.querySelector("#temperature");
//   temperature.innerHTML = "79°";
// }

// let celsius = document.querySelector("a#celsius");
// celsius.addEventListener("click", showCelsius);

//Functions to API calls & Geolocation

function retrievePosition(position) {
  let apiKey = "34c983dcfcb96cce74bfa8ccc56e5ffe";
  let units = "metric";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather";
  let apiCall = `${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(apiCall).then(showWeather);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", getCurrentPosition);

searchCity("Managua");