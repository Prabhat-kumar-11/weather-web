const apiKey = 'd4094c06e0195d75ef238b152b266823';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

function getWeather() {
  const location = document.getElementById('locationInput').value;
  if (location) {
    fetch(`${apiUrl}?q=${location}&units=metric&appid=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        if (data.cod !== 200) {
          alert(data.message);
        } else {
          displayWeather(data);
          getForecast(data.coord.lat, data.coord.lon);
        }
      })
      .catch(error => console.error('Error fetching weather data:', error));
  } else {
    alert('Please enter a location');
  }
}

function getForecast(lat, lon) {
  fetch(`${forecastUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== "200") {
        alert(data.message);
      } else {
        displayForecast(data);
      }
    })
    .catch(error => console.error('Error fetching forecast data:', error));
}

function displayWeather(data) {
  const weatherDisplay = document.getElementById('weatherDisplay');
  weatherDisplay.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <h3>${data.main.temp}°C</h3>
    <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon">
    <p>${data.weather[0].description}</p>
    <p>Wind: ${data.wind.speed} km/h</p>
    <p>Precipitation: ${data.rain ? data.rain['1h'] : 0} mm</p>
    <p>Pressure: ${data.main.pressure} mb</p>
  `;


  if (data.weather[0].main.toLowerCase().includes('rain')) {
    weatherDisplay.classList.add('rain');
    addRainAnimation(weatherDisplay);
  } else if (data.weather[0].main.toLowerCase().includes('thunderstorm')) {
    weatherDisplay.classList.add('thunderstorm');
    addThunderstormAnimation(weatherDisplay);
  } else {
    weatherDisplay.classList.remove('rain', 'thunderstorm');
  }
}

function addRainAnimation(element) {
  for (let i = 0; i < 10; i++) {
    const rainDrop = document.createElement('div');
    rainDrop.classList.add('rain-drop');
    element.appendChild(rainDrop);
  }
}

function addThunderstormAnimation(element) {
  for (let i = 0; i < 3; i++) {
    const lightning = document.createElement('div');
    lightning.classList.add('lightning');
    element.appendChild(lightning);
  }
}

function displayForecast(data) {
  const dailyForecast = document.createElement('div');
  dailyForecast.className = 'daily-forecast';

  for (let i = 0; i < data.list.length; i += 8) { 
    const forecast = data.list[i];
    const forecastElement = document.createElement('div');
    forecastElement.innerHTML = `
      <p>${new Date(forecast.dt_txt).toLocaleDateString('en-GB', { weekday: 'short' })}</p>
      <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="weather icon">
      <p>${forecast.main.temp}°C</p>
    `;
    dailyForecast.appendChild(forecastElement);
  }

  document.getElementById('weatherDisplay').appendChild(dailyForecast);
}

function getLocationAndWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetch(`${apiUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          if (data.cod !== 200) {
            alert(data.message);
          } else {
            displayWeather(data);
            // getForecast(latitude, longitude);
          }
        })
        .catch(error => console.error('Error fetching weather data:', error));
    }, () => {
      alert('Geolocation permission denied. Please enter a location manually.');
    });
  } else {
    alert('Geolocation is not supported by this browser. Please enter a location manually.');
  }
}

// Automatically fetch weather based on user's current location on page load
document.addEventListener('DOMContentLoaded', getLocationAndWeather);
