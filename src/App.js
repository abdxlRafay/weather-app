// src/App.js
import React, { useMemo, useState } from "react";
import "./App.css";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = (process.env.REACT_APP_WEATHER_KEY || "").trim();

  const bgClass = useMemo(() => {
    const main = weather?.weather?.[0]?.main?.toLowerCase() || "";
    if (main.includes("clear")) return "bg bg--clear";
    if (main.includes("cloud")) return "bg bg--clouds";
    if (main.includes("rain") || main.includes("drizzle")) return "bg bg--rain";
    if (main.includes("thunder")) return "bg bg--storm";
    if (main.includes("snow")) return "bg bg--snow";
    return "bg";
  }, [weather]);

  const getWeather = async () => {
    setError("");
    setWeather(null);

    const cityName = city.trim();
    if (!apiKey) {
      setError(
        "API key is missing. Add REACT_APP_WEATHER_KEY to .env and restart the dev server."
      );
      return;
    }
    if (!cityName) {
      setError("Please enter a city name.");
      return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      cityName
    )}&appid=${encodeURIComponent(apiKey)}&units=metric`;

    try {
      setLoading(true);
      const res = await fetch(url);
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError((data && data.message) || `Request failed: ${res.status}`);
        return;
      }
      setWeather(data);
    } catch {
      setError("Network error. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const iconUrl = weather?.weather?.[0]?.icon
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    : null;

  return (
    <div className={bgClass}>
      <div className="container">
        <header className="header">
          <div>
            <h1 className="title">Weather App</h1>
            <p className="subtitle">Search any city to get live weather updates</p>
          </div>
          <a
            className="pill"
            href="https://openweathermap.org/"
            target="_blank"
            rel="noreferrer"
            title="Data source"
          >
            OpenWeather
          </a>
        </header>

        <div className="panel">
          <form
            className="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading) getWeather();
            }}
          >
            <div className="inputWrap">
              <input
                className="input"
                type="text"
                placeholder="Enter city (e.g., Karachi, London)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Loading..." : "Get Weather"}
              </button>
            </div>
          </form>

          {error && (
            <div className="alert alert--error" role="alert">
              {error}
            </div>
          )}

          {weather?.main && (
            <div className="card" aria-live="polite">
              <div className="cardTop">
                <div>
                  <h2 className="city">
                    {weather.name}
                    {weather.sys?.country ? `, ${weather.sys.country}` : ""}
                  </h2>
                  <p className="desc">
                    {weather.weather?.[0]?.description
                      ? weather.weather[0].description
                      : ""}
                  </p>
                </div>

                {iconUrl && (
                  <img className="icon" src={iconUrl} alt="Weather icon" />
                )}
              </div>

              <div className="stats">
                <div className="stat">
                  <span className="statLabel">Temperature</span>
                  <span className="statValue">
                    {Math.round(weather.main.temp)}°C
                  </span>
                </div>

                <div className="stat">
                  <span className="statLabel">Feels like</span>
                  <span className="statValue">
                    {Math.round(weather.main.feels_like)}°C
                  </span>
                </div>

                <div className="stat">
                  <span className="statLabel">Humidity</span>
                  <span className="statValue">{weather.main.humidity}%</span>
                </div>

                <div className="stat">
                  <span className="statLabel">Wind</span>
                  <span className="statValue">
                    {typeof weather.wind?.speed === "number"
                      ? `${weather.wind.speed} m/s`
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="footer">
          <span>Tip: press Enter to search</span>
          <span className="dot">•</span>
          <span>
            Built with React{" "}
            <a
              href="https://github.com/abdxlRafay/weather-app"
              target="_blank"
              rel="noreferrer"
            >
              (GitHub)
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
}