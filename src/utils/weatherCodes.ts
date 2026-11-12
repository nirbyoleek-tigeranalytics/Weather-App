export interface WeatherCodeInfo {
  code: number;
  description: string;
  emoji: string;
  iconName: 'Sun' | 'CloudSun' | 'Cloud' | 'CloudFog' | 'CloudDrizzle' | 'CloudSnow' | 'CloudRain' | 'CloudLightning' | 'CloudHail' | 'HelpCircle';
}

/**
 * Single lookup table mapping WMO weather codes to descriptions.
 * Exact codes requested:
 * 0 Clear sky; 1 Mainly clear; 2 Partly cloudy; 3 Overcast; 45,48 Fog;
 * 51,53,55 Drizzle; 56,57 Freezing drizzle; 61,63,65 Rain; 66,67 Freezing rain;
 * 71,73,75 Snowfall; 77 Snow grains; 80,81,82 Rain showers; 85,86 Snow showers;
 * 95 Thunderstorm; 96,99 Thunderstorm with hail. Unknown code -> "Unknown".
 */
export const WMO_WEATHER_CODES: Record<number, { description: string; emoji: string; iconName: WeatherCodeInfo['iconName'] }> = {
  0: { description: 'Clear sky', emoji: '☀️', iconName: 'Sun' },
  1: { description: 'Mainly clear', emoji: '🌤️', iconName: 'CloudSun' },
  2: { description: 'Partly cloudy', emoji: '⛅', iconName: 'CloudSun' },
  3: { description: 'Overcast', emoji: '☁️', iconName: 'Cloud' },
  45: { description: 'Fog', emoji: '🌫️', iconName: 'CloudFog' },
  48: { description: 'Fog', emoji: '🌫️', iconName: 'CloudFog' },
  51: { description: 'Drizzle', emoji: '🌦️', iconName: 'CloudDrizzle' },
  53: { description: 'Drizzle', emoji: '🌦️', iconName: 'CloudDrizzle' },
  55: { description: 'Drizzle', emoji: '🌧️', iconName: 'CloudDrizzle' },
  56: { description: 'Freezing drizzle', emoji: '🧊', iconName: 'CloudSnow' },
  57: { description: 'Freezing drizzle', emoji: '🧊', iconName: 'CloudSnow' },
  61: { description: 'Rain', emoji: '🌧️', iconName: 'CloudRain' },
  63: { description: 'Rain', emoji: '🌧️', iconName: 'CloudRain' },
  65: { description: 'Rain', emoji: '🌧️', iconName: 'CloudRain' },
  66: { description: 'Freezing rain', emoji: '❄️💧', iconName: 'CloudSnow' },
  67: { description: 'Freezing rain', emoji: '❄️💧', iconName: 'CloudSnow' },
  71: { description: 'Snowfall', emoji: '🌨️', iconName: 'CloudSnow' },
  73: { description: 'Snowfall', emoji: '🌨️', iconName: 'CloudSnow' },
  75: { description: 'Snowfall', emoji: '❄️', iconName: 'CloudSnow' },
  77: { description: 'Snow grains', emoji: '🌨️', iconName: 'CloudSnow' },
  80: { description: 'Rain showers', emoji: '🌦️', iconName: 'CloudRain' },
  81: { description: 'Rain showers', emoji: '🌧️', iconName: 'CloudRain' },
  82: { description: 'Rain showers', emoji: '⛈️', iconName: 'CloudRain' },
  85: { description: 'Snow showers', emoji: '🌨️', iconName: 'CloudSnow' },
  86: { description: 'Snow showers', emoji: '🌨️', iconName: 'CloudSnow' },
  95: { description: 'Thunderstorm', emoji: '⛈️', iconName: 'CloudLightning' },
  96: { description: 'Thunderstorm with hail', emoji: '⛈️🧊', iconName: 'CloudHail' },
  99: { description: 'Thunderstorm with hail', emoji: '⛈️🧊', iconName: 'CloudHail' },
};

export function getWeatherInfo(code: number): WeatherCodeInfo {
  const match = WMO_WEATHER_CODES[code];
  if (match) {
    return {
      code,
      description: match.description,
      emoji: match.emoji,
      iconName: match.iconName,
    };
  }
  return {
    code,
    description: 'Unknown',
    emoji: '❓',
    iconName: 'HelpCircle',
  };
}
