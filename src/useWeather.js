import { useState, useEffect } from 'react';

// Bath, UK coordinates
const BATH_LAT = 51.3811;
const BATH_LON = -2.3590;

// Map Open-Meteo weather codes to our app's condition types
const mapWeatherCode = (code) => {
  if (code === 0) return 'sunny';
  if (code === 1 || code === 2) return 'partly-cloudy';
  if (code === 3) return 'cloudy';
  if (code >= 45 && code <= 48) return 'cloudy'; // fog
  if (code >= 51 && code <= 67) return 'rain'; // drizzle/rain
  if (code >= 71 && code <= 77) return 'snow'; // snow
  if (code >= 80 && code <= 82) return 'rain'; // rain showers
  if (code >= 85 && code <= 86) return 'snow'; // snow showers
  if (code >= 95 && code <= 99) return 'storm'; // thunderstorm
  return 'cloudy';
};

// Map weather code to description
const getWeatherDescription = (code) => {
  const descriptions = {
    0: 'Clear Sky',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing Rime Fog',
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'Dense Drizzle',
    61: 'Slight Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    71: 'Slight Snow',
    73: 'Moderate Snow',
    75: 'Heavy Snow',
    80: 'Slight Rain Showers',
    81: 'Moderate Rain Showers',
    82: 'Violent Rain Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Hail',
  };
  return descriptions[code] || 'Unknown';
};

// Calculate work score based on conditions
const calculateWorkScore = (temp, rain, wind) => {
  let score = 100;

  // Temperature penalties
  if (temp < 5) score -= 30;
  else if (temp < 10) score -= 15;
  if (temp > 25) score -= 10;

  // Rain penalties (rain is in mm)
  if (rain > 10) score -= 50;
  else if (rain > 5) score -= 30;
  else if (rain > 1) score -= 15;

  // Wind penalties (km/h)
  const windMph = wind * 0.621371; // Convert to mph
  if (windMph > 30) score -= 40;
  else if (windMph > 20) score -= 25;
  else if (windMph > 15) score -= 10;

  return Math.max(0, score);
};

// Generate work alerts based on forecast
const generateAlerts = (dailyData) => {
  const alerts = [];

  // Check for heavy rain in next 3 days
  const heavyRainDays = dailyData.slice(0, 3).filter(day => day.rain > 10);
  if (heavyRainDays.length > 0) {
    alerts.push({
      type: 'rain',
      title: 'Rain Expected',
      message: `Heavy rain forecast in the coming days. Plan indoor work or protect external areas.`,
      severity: 'warning'
    });
  }

  // Check for frost risk (lime work)
  const frostDays = dailyData.slice(0, 3).filter(day => day.low < 5);
  if (frostDays.length > 0) {
    alerts.push({
      type: 'lime',
      title: 'Lime Work Advisory',
      message: `Temperatures below 5°C forecast. Avoid lime pointing - risk of frost damage to fresh mortar.`,
      severity: 'danger'
    });
  }

  // Check for high winds
  const windyDays = dailyData.slice(0, 3).filter(day => day.wind * 0.621371 > 25);
  if (windyDays.length > 0) {
    alerts.push({
      type: 'wind',
      title: 'High Winds',
      message: `Strong winds forecast. Secure scaffolding and loose materials.`,
      severity: 'warning'
    });
  }

  return alerts;
};

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);

        // Open-Meteo API - free, no API key required
        const url = `https://api.open-meteo.com/v1/forecast?` +
          `latitude=${BATH_LAT}&longitude=${BATH_LON}` +
          `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure` +
          `&hourly=temperature_2m,precipitation_probability,precipitation,weather_code` +
          `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,sunrise,sunset,uv_index_max` +
          `&timezone=Europe/London` +
          `&forecast_days=7`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch weather data');

        const data = await response.json();

        // Format sunrise/sunset times
        const formatTime = (isoString) => {
          const date = new Date(isoString);
          return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
        };

        // Current weather
        const current = {
          temp: Math.round(data.current.temperature_2m),
          feelsLike: Math.round(data.current.apparent_temperature),
          condition: mapWeatherCode(data.current.weather_code),
          description: getWeatherDescription(data.current.weather_code),
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m * 0.621371), // Convert km/h to mph
          windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(data.current.wind_direction_10m / 45) % 8],
          pressure: Math.round(data.current.surface_pressure),
          visibility: 10, // Not provided by API
          uvIndex: data.daily.uv_index_max[0],
          sunrise: formatTime(data.daily.sunrise[0]),
          sunset: formatTime(data.daily.sunset[0]),
        };

        // Hourly forecast (next 10 hours)
        const now = new Date();
        const currentHour = now.getHours();
        const hourly = [];
        for (let i = 0; i < 10; i++) {
          const hourIndex = currentHour + i;
          if (hourIndex < data.hourly.time.length) {
            const hour = new Date(data.hourly.time[hourIndex]).getHours();
            hourly.push({
              time: `${hour.toString().padStart(2, '0')}:00`,
              temp: Math.round(data.hourly.temperature_2m[hourIndex]),
              condition: mapWeatherCode(data.hourly.weather_code[hourIndex]),
              rain: Math.round(data.hourly.precipitation_probability[hourIndex] || 0),
            });
          }
        }

        // Daily forecast
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const daily = data.daily.time.map((date, i) => {
          const dateObj = new Date(date);
          const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : daysOfWeek[dateObj.getDay()];
          const dateStr = dateObj.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });

          const high = Math.round(data.daily.temperature_2m_max[i]);
          const low = Math.round(data.daily.temperature_2m_min[i]);
          const rain = Math.round(data.daily.precipitation_sum[i] || 0);
          const wind = Math.round(data.daily.wind_speed_10m_max[i] * 0.621371); // Convert to mph

          return {
            day: dayName,
            date: dateStr,
            high,
            low,
            condition: mapWeatherCode(data.daily.weather_code[i]),
            rain,
            wind,
            workScore: calculateWorkScore((high + low) / 2, rain, data.daily.wind_speed_10m_max[i]),
          };
        });

        // Generate alerts
        const alerts = generateAlerts(daily);

        setWeatherData({
          current,
          hourly,
          daily,
          alerts,
        });

        setError(null);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { weatherData, loading, error };
};
