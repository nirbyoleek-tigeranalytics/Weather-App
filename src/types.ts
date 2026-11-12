export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string; // state/province/region
  admin2?: string;
  admin3?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingApiResponse {
  results?: GeoLocation[];
  generationtime_ms?: number;
}

export interface CurrentWeatherData {
  time: string;
  interval?: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface DailyForecastData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: (number | null)[];
  precipitation_sum: number[];
  uv_index_max: number[];
  wind_speed_10m_max: number[];
}

export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current: CurrentWeatherData;
  daily: DailyForecastData;
}

export interface ProcessedDailyForecast {
  date: string;
  dateObj: Date;
  weekdayShort: string;
  weekdayFull: string;
  formattedDate: string;
  weatherCode: number;
  description: string;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number | null;
  precipitationSum: number;
  uvIndexMax: number;
  windSpeedMax: number;
}

export interface RecommendationTip {
  id: string;
  rule: string;
  message: string;
  detail: string;
  type: 'umbrella' | 'heat' | 'cold' | 'uv' | 'wind' | 'pleasant';
  severity: 'warning' | 'alert' | 'caution' | 'success' | 'info';
  applicableDays?: string[];
}

export interface BestOutdoorDay {
  date: string;
  weekday: string;
  reason: string;
  precipProb: number;
  tempMax: number;
  tempMin: number;
  condition: string;
}

export interface RecommendationSummary {
  tips: RecommendationTip[];
  bestDay: BestOutdoorDay | null;
}
