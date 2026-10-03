"use client";

import { useEffect, useMemo, useState } from "react";

type WeatherState = {
  temperature: number | null;
  code: number | null;
};

function weatherLabel(code: number | null) {
  if (code === null) return "LIVE WEATHER";
  if (code === 0) return "CLEAR";
  if ([1, 2].includes(code)) return "PARTLY CLOUDY";
  if (code === 3) return "OVERCAST";
  if ([45, 48].includes(code)) return "FOG";
  if ([51, 53, 55, 56, 57].includes(code)) return "DRIZZLE";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "RAIN";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "SNOW";
  if ([95, 96, 99].includes(code)) return "STORM";
  return "LIVE WEATHER";
}

export default function DevonLiveMeta() {
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState<WeatherState>({ temperature: null, code: null });

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=40.7608&longitude=-111.8910&current=temperature_2m,weather_code&temperature_unit=fahrenheit",
      { signal: controller.signal }
    )
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("weather"))))
      .then((data) => {
        setWeather({
          temperature:
            typeof data?.current?.temperature_2m === "number" ? Math.round(data.current.temperature_2m) : null,
          code: typeof data?.current?.weather_code === "number" ? data.current.weather_code : null,
        });
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  const time = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Denver",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now),
    [now]
  );

  return (
    <div className="db-live-meta" aria-label="Live portfolio context">
      <span className="db-live-pulse" />
      <span>{time} MDT</span>
      <span>40.7608° N / 111.8910° W</span>
      <span>SALT LAKE CITY</span>
      <span>
        {weather.temperature !== null ? `${weather.temperature}°F · ` : ""}
        {weatherLabel(weather.code)}
      </span>
    </div>
  );
}
