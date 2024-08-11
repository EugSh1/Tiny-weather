import axios from "axios";

export function getCityNameFromLocalStorage() {
    return localStorage.getItem("cityName") || "London";
}

export function setNewCityNameToLocalStorage(newCityName) {
    localStorage.setItem("cityName", newCityName);
}

export async function fetchWeatherData() {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${getCityNameFromLocalStorage()}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`, {
            timeout: 5000
        });
        return response.data;
    }

    catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

function getBeaufortMessage(windKmh) {
    const floorWindKmh = Math.floor(windKmh);

    if (floorWindKmh >= 118) {
        return "Hurricane-force, 12bft";
    }

    else if (floorWindKmh <= 117 && floorWindKmh >= 103) {
        return "Violent storm, 11bft";
    }

    else if (floorWindKmh <= 102 && floorWindKmh >= 88) {
        return "Storm, 10bft";
    }

    else if (floorWindKmh <= 87 && floorWindKmh >= 75) {
        return "Strong gale, 9bft";
    }

    else if (floorWindKmh <= 74 && floorWindKmh >= 62) {
        return "Gale, 8bft";
    }

    else if (floorWindKmh <= 61 && floorWindKmh >= 50) {
        return "High wind, 7bft";
    }

    else if (floorWindKmh <= 49 && floorWindKmh >= 34) {
        return "Strong breeze, 6bft";
    }

    else if (floorWindKmh <= 38 && floorWindKmh >= 29) {
        return "Fresh breeze, 5bft";
    }

    else if (floorWindKmh <= 28 && floorWindKmh >= 20) {
        return "Moderate breeze, 4bft";
    }

    else if (floorWindKmh <= 19 && floorWindKmh >= 12) {
        return "Gentle breeze, 3bft";
    }

    else if (floorWindKmh <= 11 && floorWindKmh >= 6) {
        return "Light breeze, 2bft";
    }

    else if (floorWindKmh <= 5 && floorWindKmh >= 2) {
        return "Light air, 1bft";
    }

    else if (floorWindKmh < 2) {
        return "Calm, 0bft";
    }
}

function random(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);

    return rand;
}

function rain() {
    for (var i = 0; i < 200; i++) {
        var rainElement = document.createElement("i");
        rainElement.classList.add("rain");
        rainElement.style.left = random(-2000, 2000) + "px";
        rainElement.style.transform = "translate3d(0, 0, 0)";
        rainElement.style.animationDelay = 0.01 * i + "s";
        document.body.appendChild(rainElement);
    }
}

function snow() {
    const snowScript = document.createElement("script");

    snowScript.src = "http://mihailmaximov.ru/projects/snow/snowfall2020.js";
    snowScript.type = "text/javascript";

    document.body.appendChild(snowScript);
}

export function displayWeatherConditions(weatherNow) {
    switch (weatherNow) {
        case "Clear":
            document.body.style.background = "linear-gradient(to bottom, #B0E0E6, #87CEEB) no-repeat";
            document.body.style.backgroundColor = "#87CEEB";
            break;

        case "Clouds":
        case "Mist":
        case "Fog":
        case "Haze":
            document.body.style.background = "linear-gradient(to bottom, #CBD5DB, #8fa7b3, #647985) no-repeat";
            document.body.style.backgroundColor = "#647985";
            break;

        case "Rain":
        case "Drizzle":
            document.body.style.background = "linear-gradient(to bottom, #B0C4DE, #708090) no-repeat";
            document.body.style.backgroundColor = "#708090";
            rain();
            break;

        case "Snow":
            document.body.style.background = "linear-gradient(to bottom, #D3E0E8, #B0C4DE) no-repeat";
            document.body.style.backgroundColor = "#B0C4DE";
            snow();
            break;

        case "Thunderstorm":
            document.body.style.background = "linear-gradient(to bottom, #6C7B8B, #2C3E50) no-repeat";
            document.body.style.backgroundColor = "#2C3E50";
            rain();
            break;

        default:
            break;
    }
}

export async function getWeatherData() {
    const weatherData = await fetchWeatherData();

    if (!weatherData) {
        return null;
    }

    const windKmh = (weatherData.wind.speed * 3.6).toFixed(2);

    return {
        weatherNow: weatherData.weather[0].main,
        city: weatherData.name,
        temperature: `${Math.trunc(weatherData.main.temp - 273.15)}˚`,
        feelsLike: `${Math.trunc(weatherData.main.feels_like - 273.15)}˚`,
        humidity: `${weatherData.main.humidity}%`,
        pressureHpa: `${weatherData.main.pressure}hPa`,
        pressureInhg: `${(weatherData.main.pressure / 33.863886666667).toFixed(2)}inHg`,
        windMs: `${weatherData.wind.speed.toFixed(2)}m/s`,
        windKmh: `${windKmh}km/h`,
        beaufortMessage: getBeaufortMessage(windKmh)
    };
}