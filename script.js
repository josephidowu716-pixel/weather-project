const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");
const forecastContainer = document.getElementById("forecastContainer");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if(city){
        getCoordinates(city);
    }
});

async function getCoordinates(city){

    try{

        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
        );

        const data = await response.json();

        if(!data.results){
            alert("City not found");
            return;
        }

        const result = data.results[0];

        getWeather(
            result.latitude,
            result.longitude,
            result.name,
            result.country
        );

    }
    catch(error){
        alert("Error finding city");
        console.log(error);
    }

}

async function getWeather(lat, lon, city, country){

    try{

        const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;

        const response = await fetch(url);

        const data = await response.json();

        displayCurrentWeather(data, city, country);

        displayForecast(data.daily);

    }
    catch(error){
        console.log(error);
        alert("Unable to fetch weather");
    }

}

function displayCurrentWeather(data, city, country){

    cityName.textContent = `${city}, ${country}`;

    temperature.textContent =
        `${Math.round(data.current.temperature_2m)}°C`;

    humidity.textContent =
        `${data.current.relative_humidity_2m}%`;

    wind.textContent =
        `${data.current.wind_speed_10m} km/h`;

    const weather = getWeatherDescription(
        data.current.weather_code
    );

    description.textContent = weather.text;

    weatherIcon.textContent = weather.icon;
}

function displayForecast(daily){

    forecastContainer.innerHTML = "";

    for(let i=0; i<5; i++){

        const date = new Date(daily.time[i]);

        const day = date.toLocaleDateString("en-US", {
            weekday:"long"
        });

        const weather =
            getWeatherDescription(daily.weather_code[i]);

        forecastContainer.innerHTML += `
            <div class="forecast-item">
                <div class="day">${day}</div>

                <div class="icon">
                    ${weather.icon}
                </div>

                <div class="temp">
                    ${Math.round(daily.temperature_2m_max[i])}°
                    <br>
                    <span>
                    ${Math.round(daily.temperature_2m_min[i])}°
                    </span>
                </div>
            </div>
        `;
    }
}

function getWeatherDescription(code){

    if(code === 0){
        return {
            text:"Clear Sky",
            icon:"☀️"
        };
    }

    if([1,2,3].includes(code)){
        return {
            text:"Partly Cloudy",
            icon:"🌤️"
        };
    }

    if([45,48].includes(code)){
        return {
            text:"Foggy",
            icon:"🌫️"
        };
    }

    if([51,53,55].includes(code)){
        return {
            text:"Drizzle",
            icon:"🌦️"
        };
    }

    if([61,63,65].includes(code)){
        return {
            text:"Rain",
            icon:"🌧️"
        };
    }

    if([71,73,75].includes(code)){
        return {
            text:"Snow",
            icon:"❄️"
        };
    }

    if([80,81,82].includes(code)){
        return {
            text:"Rain Showers",
            icon:"🌦️"
        };
    }

    if(code === 95){
        return {
            text:"Thunderstorm",
            icon:"⛈️"
        };
    }

    return {
        text:"Unknown",
        icon:"🌍"
    };
}

getCoordinates("Lagos"); 