/**
 * Centralized rule-based thresholds for outdoor planning recommendations.
 * Easily reviewed and adjusted as requested in specifications.
 */
export const RECOMMENDATION_THRESHOLDS = {
  // Rain / Umbrella threshold (%)
  PRECIPITATION_PROBABILITY_MAX: 60,

  // Heat warning threshold (°C)
  TEMPERATURE_MAX_HIGH: 35,

  // Cold layer threshold (°C)
  TEMPERATURE_MIN_LOW: 5,

  // High UV sunscreen threshold (UV Index)
  UV_INDEX_MAX_HIGH: 8,

  // Strong wind alert threshold (km/h)
  WIND_SPEED_MAX_HIGH: 40,

  // Baseline reference for "milder temperature" tie-breaking (°C)
  // Moderate comfort range midpoint (~21°C)
  IDEAL_COMFORT_TEMP: 21,
} as const;

export const INITIAL_POPULAR_CITIES = [
  'Chennai',
  'London',
  'Tokyo',
  'New York',
  'Sydney',
  'Paris',
] as const;
