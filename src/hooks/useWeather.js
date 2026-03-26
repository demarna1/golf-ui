import { useState, useEffect } from 'react';

function wmoToEmoji(code) {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code <= 3) return '☁️';
  if (code <= 49) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '🌨️';
  if (code <= 82) return '🌦️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}

// Fetches daily high temperature (°F) and weather emoji for the given dates
// at the specified location string (e.g. "Myrtle Beach, SC").
// Returns a map of { [date: string]: { temp: number, emoji: string } }.
export function useWeather(location, dates) {
  const [weather, setWeather] = useState({});
  const datesKey = dates.join(',');

  useEffect(() => {
    if (!location || !datesKey) return;

    let cancelled = false;

    async function load() {
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`
        );
        const geoData = await geoRes.json();
        if (!geoData.results?.length || cancelled) return;

        const { latitude, longitude } = geoData.results[0];
        const sorted = [...dates].sort();

        const wxRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,weathercode&temperature_unit=fahrenheit&timezone=auto&start_date=${sorted[0]}&end_date=${sorted[sorted.length - 1]}`
        );
        const wxData = await wxRes.json();
        if (cancelled) return;

        const result = {};
        wxData.daily?.time?.forEach((date, i) => {
          result[date] = {
            temp: Math.round(wxData.daily.temperature_2m_max[i]),
            emoji: wmoToEmoji(wxData.daily.weathercode[i]),
          };
        });
        setWeather(result);
      } catch {
        // weather is non-critical, fail silently
      }
    }

    load();
    return () => { cancelled = true; };
  }, [location, datesKey]);

  return weather;
}
