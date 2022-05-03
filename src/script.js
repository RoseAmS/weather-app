//Showing actual date and time - based on current location

function formatDate(timestamp) {
  let d = new Date();
  let utc = d.getTime() + d.getTimezoneOffset() * 60000;
  let dateTime = new Date(utc + 3600000 * (timestamp / 3600));

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

  let day = days[dateTime.getDay()];
  let date = dateTime.getDate();
  let month = months[dateTime.getMonth()];

  let hour = dateTime.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  let ampm = hour >= 12 ? "PM" : "AM";
  if (hour > 12) {
    hour = hour - 12;
    if (hour < 10) {
      hour = `0${hour}`;
    }
  }

  let minutes = dateTime.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day}, ${month} ${date} ${hour}:${minutes} ${ampm}`;
}

//Format day from Forecast

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

//Find weather icon based on code
function searchIcon(icon) {
  let arr = [
    {
      code: "01d",
      value:
        "https://raw.githubusercontent.com/basmilius/weather-icons/dev/production/fill/lottie/clear-day.json",
    },
    {
      code: "01n",
      value:
        "https://raw.githubusercontent.com/basmilius/weather-icons/dev/production/fill/lottie/clear-night.json",
    },
    {
      code: "02d",
      value:
        "https://raw.githubusercontent.com/basmilius/weather-icons/dev/production/fill/lottie/partly-cloudy-day.json",
    },
    {
      code: "02n",
      value:
        "https://raw.githubusercontent.com/basmilius/weather-icons/dev/production/fill/lottie/partly-cloudy-night.json",
    },
    {
      code: "03d",
      value:
        "https://raw.githubusercontent.com/basmilius/weather-icons/dev/production/fill/lottie/cloudy.json",
    },
    {
      code: "03n",
      value:
        "https://raw.githubusercontent.com/basmilius/weather-icons/dev/production/fill/lottie/cloudy.json",
    },
    {
      code: "04d",
      value:
        "https://raw.githubusercontent.com/basmilius/weather-icons/dev/production/fill/lottie/overcast-day.json",
    },
    {
      code: "04n",
      value:
        "https://raw.githubusercontent.com/basmilius/weather-icons/dev/production/fill/lottie/overcast-night.json",
    },
    {
      code: "09d",
      value:
        "https://raw.githubusercontent.com/basmilius/weather-icons/dev/production/fill/lottie/drizzle.json",
    },
    {
      code: "10d",
      value:
        "https://raw.githubusercontent.com/basmilius/weather-icons/dev/production/fill/lottie/extreme-rain.json",
    },
    {
      code: "11d",
      value:
        "https://raw.githubusercontent.com/basmilius/weather-icons/dev/production/fill/lottie/thunderstorms.json",
    },
    {
      code: "13d",
      value:
        "https://raw.githubusercontent.com/basmilius/weather-icons/dev/production/fill/lottie/snow.json",
    },
    {
      code: "50d",
      value:
        "https://raw.githubusercontent.com/basmilius/weather-icons/dev/production/fill/lottie/tornado.json",
    },
  ];

  let obj = arr.find((o) => o.code === icon);

  return obj.value;
}

//Display Forecast and add HTML info
function displayForecast(response) {
  let forecast = response.data.daily;

  console.log(response);

  let forecastElement = document.querySelector("#forecast");

  // Creating days array to loop and create HTML
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastMax = forecastDay.temp.max;
      forecastMin = forecastDay.temp.min;
      forecastHTML =
        forecastHTML +
        `
          <div class="col-2">
            <div class="weather-forecast-date">
              ${formatDay(forecastDay.dt)}
            </div>
            <lottie-player
                  src="${searchIcon(forecastDay.weather[0].icon)}"
                  background="transparent"
                  speed="3"
                  style="width: 80px"
                  loop
                  autoplay
                  alt="${forecastDay.weather[0].main}"
                ></lottie-player>
            <div class="weather-forecast-temperature">
              <span class="weather-forecast-temp-max"> ${Math.round(
                forecastDay.temp.max
              )}° </span>
              <span class="weather-forecast-temp-min"> ${Math.round(
                forecastDay.temp.min
              )}° </span>
            </div>
          </div>
          `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//Get coordinates from city & then call displayForecast
function getForecast(coordinates) {
  let apiKey = "34c983dcfcb96cce74bfa8ccc56e5ffe";
  let units = "metric";
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiUrl = "https://api.openweathermap.org/data/2.5/onecall";
  let apiCall = `${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(apiCall).then(displayForecast);
}

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
  let iconMain = searchIcon(response.data.weather[0].icon);

  celsiusTemp = response.data.main.temp;
  feelsLikeTemp = response.data.main.feels_like;

  document.querySelector("#date-time").innerHTML = formatDate(
    response.data.timezone
  );

  document.querySelector("h2").innerHTML = `${city}, ${country}`;

  document.querySelector("#icon-main").setAttribute(
    "src",
    "${iconMain}"
    // `https://openweathermap.org/img/wn/${iconMain}@2x.png`
  );

  console.log("#icon-Main");

  document
    .querySelector("#icon-main")
    .setAttribute("alt", response.data.weather[0].main);

  document.querySelector("#temperature").innerHTML = Math.round(celsiusTemp);

  document.querySelector("#feels-like").innerHTML = Math.round(feelsLikeTemp);

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;

  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  document.querySelector("h3").innerHTML = response.data.weather[0].main;

  //Logging city coordinates
  getForecast(response.data.coord);
}

//Functions to convert temperatures
//Convert to Fahrenheit

function showFahrenheit(event) {
  event.preventDefault();

  document.querySelector("#temperature").innerHTML = Math.round(
    (Number(celsiusTemp) * 9) / 5 + 32
  );

  document.querySelector("#feels-like").innerHTML = Math.round(
    (Number(feelsLikeTemp) * 9) / 5 + 32
  );

  //remove the active class from Celsius & assigns to Fahrenheit
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
}

let fahrenheit = document.querySelector("a#fahrenheit");
fahrenheit.addEventListener("click", showFahrenheit);

//Convert to Celsius
function showCelsius(event) {
  event.preventDefault();

  document.querySelector("#temperature").innerHTML = Math.round(celsiusTemp);

  document.querySelector("#feels-like").innerHTML = Math.round(feelsLikeTemp);

  //remove the active class from Fahrenheit & assigns to Celsius
  celsius.classList.add("active");
  fahrenheit.classList.remove("active");
}

let celsius = document.querySelector("a#celsius");
celsius.addEventListener("click", showCelsius);

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

//Global variables

let celsiusTemp = null;
let feelsLikeTemp = null;

searchCity("Managua");
