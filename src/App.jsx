import { useEffect, useState } from "react";
import {
    getWeatherData,
    displayWeatherConditions,
    setNewCityNameToLocalStorage,
    getCityNameFromLocalStorage
} from "./utils";
import InfoCard from "./components/InfoCard";

export default function App() {
    const [weather, setWeather] = useState(null);
    const [cityName, setCityName] = useState(getCityNameFromLocalStorage());
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            const data = await getWeatherData();
            if (data) {
                setWeather(data);
                displayWeatherConditions(data.weatherNow);
            } else {
                console.error("Failed to fetch weather data.");
                setError(true);
            }
        };

        fetchWeather();
    }, [cityName]);

    if (error) {
        return (
            <p className="message-text">
                Weather data is currently unavailable.
                <br />
                You may have entered a non-existent city.
                <br />
                Selected city: {cityName}
                <br />
                <button onClick={changeCity}>Click to change the city</button>
                <br />
                <p>
                    If the city you selected does exist, then try waiting a bit,
                    <br />
                    depending on your API requests per minute limit.
                </p>
            </p>
        );
    }

    if (weather && document.body.classList.contains("display-message")) {
        document.body.classList.remove("display-message");
    }

    if (!weather) {
        document.body.classList.add("display-message");
        return <p className="message-text">Loading...</p>;
    }

    function changeCity() {
        const newCityName = prompt("Enter new city name:").trim();
        if (newCityName === "") {
            alert("City name can't be empty");
            return;
        }
        setCityName(newCityName);
        setError(false);
        setNewCityNameToLocalStorage(newCityName);
    }

    return (
        <>
            <p id="display-city" onClick={changeCity}>
                {weather.city}
            </p>
            <p id="display-temperature">{weather.temperature}</p>
            <p id="display-weather">{weather.weatherNow}</p>

            <div className="container">
                <InfoCard title="Feels like" details={weather.feelsLike} />
                <InfoCard title="Humidity" details={weather.humidity} />
                <InfoCard
                    title="Pressure"
                    details={weather.pressureHpa}
                    lowerDetails={weather.pressureInhg}
                />
                <InfoCard
                    title="Wind speed"
                    details={weather.windMs}
                    lowerDetails={
                        <>
                            {weather.windKmh}
                            <br />
                            {weather.beaufortMessage}
                        </>
                    }
                />
            </div>
        </>
    );
}
