// src/App.js
import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = (process.env.REACT_APP_WEATHER_KEY || "").trim();

  const getWeather = async () => {
    setError("");
    setWeather(null);

    const cityName = city.trim();

    if (!apiKey) {
      setError(
        "API key is missing. Add REACT_APP_WEATHER_KEY to your .env file and restart the dev server."
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

      const response = await fetch(url);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Request failed: ${response.status}`;
        setError(msg);
        return;
      }

      setWeather(data);
    } catch {
      setError("Network error. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Weather App</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!loading) getWeather();
        }}
        style={{ display: "flex", gap: "10px", justifyContent: "center" }}
      >
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get Weather"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}

      {weather?.main && (
        <div className="card" style={{ marginTop: 18 }}>
          <h2>
            {weather.name}
            {weather.sys?.country ? `, ${weather.sys.country}` : ""}
          </h2>

          <p style={{ textTransform: "capitalize" }}>
            {weather.weather?.[0]?.description || ""}
          </p>

          <p>Temperature: {Math.round(weather.main.temp)}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>
            Wind:{" "}
            {typeof weather.wind?.speed === "number"
              ? `${weather.wind.speed} m/s`
              : "-"}
          </p>
        </div>
      )}
    </div>
  );
}