/*const apiKey = 'f89c9e638d04a9086ec496cabd5468e5';
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search-box input");
const searchBtn = document.querySelector(".search-box button");
const image = document.querySelector('.weather-box img');

async function checkWearher(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    var data = await response.json();
    weather_type = data.weather[0].main;
    console.log(data);

    
    document.querySelector(".description").innerHTML = data.name;
    document.querySelector(".temperature").innerHTML = `${parseInt(data.main.temp)}<span>°C</span>`;
    document.querySelector(".info-humidity").innerHTML = `${data.main.humidity}%`;
    document.querySelector(".info-wind ").innerHTML = `${parseInt(data.wind.speed)} Km/h`;

    switch (data.weather[0].main){
        case 'Clear':
            image.src = 'images/clear.png';
            document.body.style.background = "linear-gradient(to bottom, #f7b733, #fc4a1a)";
            break;

        case 'Rain':
            image.src = 'images/rain.png';
            document.body.style.background = "linear-gradient(to bottom, #203a43, #2c5364)";
            break;

        case 'Snow':
            image.src = 'images/snow.png';
            break;

        case 'Clouds':
            image.src = 'images/cloud.png';
            break;

        case 'Mist':

            image.src = 'images/mist.png';
            break;

        case 'Haze':
            image.src = 'images/mist.png';
            break;

        default:
            image.src = 'images/cloud.png';

    }

}

searchBtn.addEventListener('click', () => {
    checkWearher(searchBox.value);
});*/

const container = document.querySelector('.container');
const searchBtn = document.querySelector('.search-box button');
const searchInput = document.querySelector('.search-box input');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
    const formattedDate = now.toLocaleDateString('en-US', options);
    const dateTimeElement = document.querySelector('.date-time');
    if (dateTimeElement) dateTimeElement.innerHTML = formattedDate;
}

async function checkWeather(cityOrCoords) {
    const apiKey = 'f89c9e638d04a9086ec496cabd5468e5';
    let url = '';

    if (typeof cityOrCoords === 'string') {
        if (cityOrCoords === '') return;
        url = `https://api.openweathermap.org/data/2.5/weather?q=${cityOrCoords}&units=metric&appid=${apiKey}`;
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${cityOrCoords.lat}&lon=${cityOrCoords.lon}&units=metric&appid=${apiKey}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === '404') {
        container.style.height = '400px';
        weatherBox.style.display = 'none';
        weatherDetails.style.display = 'none';
        error404.style.display = 'block';
        return;
    }

    error404.style.display = 'none';
    container.style.height = 'auto';
    weatherBox.style.display = 'block';
    weatherDetails.style.display = 'flex';

    document.querySelector(".temperature").innerHTML = `${Math.round(data.main.temp)}<span>°C</span>`;
    document.querySelector(".description").innerHTML = data.weather[0].description;
    document.querySelector(".info-humidity span").innerHTML = `${data.main.humidity}%`;
    document.querySelector(".info-wind span").innerHTML = `${Math.round(data.wind.speed)} Km/h`;
    
    updateDateTime(); 
    const image = document.querySelector('.weather-box img');
    const status = data.weather[0].main;
    const body = document.body;

    const backgrounds = {
        'Clear': 'linear-gradient(to bottom, #f7b733, #fc4a1a)', 
        'Rain': 'linear-gradient(to bottom, #2c3e50, #4ca1af)',  
        'Snow': 'linear-gradient(to bottom, #83a4d4, #b6fbff)',  
        'Clouds': 'linear-gradient(to bottom, #bdc3c7, #2c3e50)', 
        'Mist': 'linear-gradient(to bottom, #606c88, #3f4c6b)',  
        'Haze': 'linear-gradient(to bottom, #757f9a, #d7dde8)',  
        'Thunderstorm': 'linear-gradient(to bottom, #1f1c2c, #928dab)' 
    };
    body.style.background = backgrounds[status] || 'linear-gradient(to bottom, #06283d, #1d5c63)';
    body.style.backgroundAttachment = 'fixed'; 
    body.style.transition = 'background 0.5s ease'; 
}

window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const coords = {
                lat: position.coords.latitude,
                lon: position.coords.longitude
            };
            checkWeather(coords);
        }, (error) => {
            console.log("Location access denied");
        });
    }
});

searchBtn.addEventListener('click', () => checkWeather(searchInput.value));
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkWeather(searchInput.value);
});