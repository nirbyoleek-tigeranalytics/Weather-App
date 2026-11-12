import {
  GeocodingApiResponse,
  GeoLocation,
  ProcessedDailyForecast,
  WeatherApiResponse,
} from '../types';
import { getWeatherInfo } from '../utils/weatherCodes';

export class WeatherApiError extends Error {
  status?: number;
  isCityNotFound: boolean;

  constructor(message: string, status?: number, isCityNotFound = false) {
    super(message);
    this.name = 'WeatherApiError';
    this.status = status;
    this.isCityNotFound = isCityNotFound;
  }
}

/**
 * Geocodes a city query using Open-Meteo Geocoding API.
 * Query: GET https://geocoding-api.open-meteo.com/v1/search?name={city}&count=5&language=en&format=json
 */
export async function searchCities(query: string): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new WeatherApiError('Please enter a city name to search.', undefined, false);
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmed
  )}&count=5&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new WeatherApiError(
        `Failed to reach geocoding service (${response.status}: ${response.statusText})`,
        response.status
      );
    }

    const data: GeocodingApiResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new WeatherApiError(
        'City not found. Check the spelling and try again.',
        200,
        true
      );
    }

    return data.results;
  } catch (error) {
    if (error instanceof WeatherApiError) {
      throw error;
    }
    throw new WeatherApiError(
      'Network error while searching for city. Please check your internet connection and try again.'
    );
  }
}

/**
 * Fetches 7-day weather forecast with current conditions using Open-Meteo Forecast API.
 * Query parameters required:
 * ?latitude={lat}&longitude={lon}
 * &current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m
 * &daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,uv_index_max,wind_speed_10m_max
 * &timezone=auto&forecast_days=7
 */
export async function fetchWeatherForecast(
  latitude: number,
  longitude: number
): Promise<WeatherApiResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,uv_index_max,wind_speed_10m_max',
    timezone: 'auto',
    forecast_days: '7',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new WeatherApiError(
        `Failed to retrieve weather forecast (${response.status}: ${response.statusText})`,
        response.status
      );
    }

    const data: WeatherApiResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof WeatherApiError) {
      throw error;
    }
    throw new WeatherApiError(
      'Network error while fetching weather data. Please check your connection and retry.'
    );
  }
}

/**
 * Transforms raw daily arrays from Open-Meteo into cleanly structured items for UI cards and charts.
 */
export function processDailyData(
  daily: WeatherApiResponse['daily'],
  timezone?: string
): ProcessedDailyForecast[] {
  if (!daily || !daily.time || daily.time.length === 0) {
    return [];
  }

  return daily.time.map((timeStr, index) => {
    // Parse date safely (YYYY-MM-DD)
    const [year, month, day] = timeStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);

    const weekdayShort = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      timeZone: timezone,
    });
    const weekdayFull = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      timeZone: timezone,
    });
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: timezone,
    });

    const weatherCode = daily.weather_code[index] ?? 0;
    const weatherInfo = getWeatherInfo(weatherCode);

    return {
      date: timeStr,
      dateObj,
      weekdayShort,
      weekdayFull,
      formattedDate,
      weatherCode,
      description: weatherInfo.description,
      tempMax: daily.temperature_2m_max[index] ?? 0,
      tempMin: daily.temperature_2m_min[index] ?? 0,
      precipitationProbability: daily.precipitation_probability_max[index] ?? 0,
      precipitationSum: daily.precipitation_sum[index] ?? 0,
      uvIndexMax: daily.uv_index_max[index] ?? 0,
      windSpeedMax: daily.wind_speed_10m_max[index] ?? 0,
    };
  });
}
