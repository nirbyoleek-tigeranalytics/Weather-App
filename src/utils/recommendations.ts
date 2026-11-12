import {
  BestOutdoorDay,
  ProcessedDailyForecast,
  RecommendationSummary,
  RecommendationTip,
} from '../types';
import { RECOMMENDATION_THRESHOLDS } from './constants';

/**
 * Generate 3-5 simple, rule-based planning recommendations derived ONLY from fetched values,
 * and identify the best day of the week for outdoor activities.
 */
export function generateRecommendations(
  dailyList: ProcessedDailyForecast[]
): RecommendationSummary {
  if (!dailyList || dailyList.length === 0) {
    return { tips: [], bestDay: null };
  }

  const tips: RecommendationTip[] = [];

  // Check 1: Umbrella / Precipitation
  // Rule: precipitation_probability_max >= 60 -> "Carry an umbrella"
  const rainDays = dailyList.filter(
    (d) =>
      d.precipitationProbability !== null &&
      d.precipitationProbability >= RECOMMENDATION_THRESHOLDS.PRECIPITATION_PROBABILITY_MAX
  );
  if (rainDays.length > 0) {
    const dayNames = rainDays
      .map((d) => `${d.weekdayShort} (${d.precipitationProbability}%)`)
      .join(', ');
    tips.push({
      id: 'rec-rain',
      rule: `precipitation_probability_max ≥ ${RECOMMENDATION_THRESHOLDS.PRECIPITATION_PROBABILITY_MAX}%`,
      message: 'Carry an umbrella',
      detail: `Elevated rain probability on: ${dayNames}. Prepare waterproof gear before heading outside.`,
      type: 'umbrella',
      severity: 'warning',
      applicableDays: rainDays.map((d) => d.weekdayFull),
    });
  }

  // Check 2: High Temperature
  // Rule: temperature_2m_max >= 35 -> "Avoid outdoor activity at midday; stay hydrated"
  const hotDays = dailyList.filter(
    (d) => d.tempMax >= RECOMMENDATION_THRESHOLDS.TEMPERATURE_MAX_HIGH
  );
  if (hotDays.length > 0) {
    const dayNames = hotDays.map((d) => `${d.weekdayShort} (${Math.round(d.tempMax)}°C)`).join(', ');
    tips.push({
      id: 'rec-heat',
      rule: `temperature_2m_max ≥ ${RECOMMENDATION_THRESHOLDS.TEMPERATURE_MAX_HIGH}°C`,
      message: 'Avoid outdoor activity at midday; stay hydrated',
      detail: `Intense heat forecasted on: ${dayNames}. Seek shade and replenish fluids frequently.`,
      type: 'heat',
      severity: 'alert',
      applicableDays: hotDays.map((d) => d.weekdayFull),
    });
  }

  // Check 3: Low Temperature
  // Rule: temperature_2m_min <= 5 -> "Wear warm layers"
  const coldDays = dailyList.filter(
    (d) => d.tempMin <= RECOMMENDATION_THRESHOLDS.TEMPERATURE_MIN_LOW
  );
  if (coldDays.length > 0) {
    const dayNames = coldDays.map((d) => `${d.weekdayShort} (${Math.round(d.tempMin)}°C)`).join(', ');
    tips.push({
      id: 'rec-cold',
      rule: `temperature_2m_min ≤ ${RECOMMENDATION_THRESHOLDS.TEMPERATURE_MIN_LOW}°C`,
      message: 'Wear warm layers',
      detail: `Chilly conditions expected on: ${dayNames}. Dress in thermal or wind-resistant clothing.`,
      type: 'cold',
      severity: 'caution',
      applicableDays: coldDays.map((d) => d.weekdayFull),
    });
  }

  // Check 4: High UV Index
  // Rule: uv_index_max >= 8 -> "High UV — use sunscreen"
  const uvDays = dailyList.filter(
    (d) => d.uvIndexMax >= RECOMMENDATION_THRESHOLDS.UV_INDEX_MAX_HIGH
  );
  if (uvDays.length > 0) {
    const dayNames = uvDays.map((d) => `${d.weekdayShort} (UV ${d.uvIndexMax})`).join(', ');
    tips.push({
      id: 'rec-uv',
      rule: `uv_index_max ≥ ${RECOMMENDATION_THRESHOLDS.UV_INDEX_MAX_HIGH}`,
      message: 'High UV — use sunscreen',
      detail: `Significant solar radiation on: ${dayNames}. Apply broad-spectrum SPF 30+ and wear sunglasses.`,
      type: 'uv',
      severity: 'alert',
      applicableDays: uvDays.map((d) => d.weekdayFull),
    });
  }

  // Check 5: Strong Winds
  // Rule: wind_speed_10m_max >= 40 -> "Strong winds expected"
  const windyDays = dailyList.filter(
    (d) => d.windSpeedMax >= RECOMMENDATION_THRESHOLDS.WIND_SPEED_MAX_HIGH
  );
  if (windyDays.length > 0) {
    const dayNames = windyDays.map((d) => `${d.weekdayShort} (${Math.round(d.windSpeedMax)} km/h)`).join(', ');
    tips.push({
      id: 'rec-wind',
      rule: `wind_speed_10m_max ≥ ${RECOMMENDATION_THRESHOLDS.WIND_SPEED_MAX_HIGH} km/h`,
      message: 'Strong winds expected',
      detail: `Gusty airflow expected on: ${dayNames}. Secure loose lightweight items and take care while cycling.`,
      type: 'wind',
      severity: 'warning',
      applicableDays: windyDays.map((d) => d.weekdayFull),
    });
  }

  // Fallback Rule: "otherwise -> Good conditions for outdoor plans"
  if (tips.length === 0) {
    tips.push({
      id: 'rec-pleasant',
      rule: 'All meteorological thresholds within comfortable bounds',
      message: 'Good conditions for outdoor plans',
      detail: 'No extreme precipitation, intense heat, freezing lows, high UV, or gale winds detected across the forecast period.',
      type: 'pleasant',
      severity: 'success',
    });
  }

  // Find the BEST day of the week for outdoor plans:
  // "lowest precipitation probability, ties broken by milder temperature"
  // Exclude days where precipitationProbability is null
  const eligibleDays = dailyList.filter(
    (d): d is ProcessedDailyForecast & { precipitationProbability: number } =>
      d.precipitationProbability !== null
  );

  let bestDay: BestOutdoorDay | null = null;

  if (eligibleDays.length > 0) {
    const sortedDays = [...eligibleDays].sort((a, b) => {
      // 1. Lowest precipitation probability
      if (a.precipitationProbability !== b.precipitationProbability) {
        return a.precipitationProbability - b.precipitationProbability;
      }
      // 2. Ties broken by milder temperature (closest to ideal comfort ~21°C)
      const distA = Math.abs(a.tempMax - RECOMMENDATION_THRESHOLDS.IDEAL_COMFORT_TEMP);
      const distB = Math.abs(b.tempMax - RECOMMENDATION_THRESHOLDS.IDEAL_COMFORT_TEMP);
      if (distA !== distB) {
        return distA - distB;
      }
      // 3. Lower max wind speed as secondary tie-breaker
      return a.windSpeedMax - b.windSpeedMax;
    });

    const best = sortedDays[0];
    const isComfortable = best.tempMax >= 15 && best.tempMax <= 28;
    const tempText = isComfortable
      ? `comfortable max of ${Math.round(best.tempMax)}°C`
      : `max of ${Math.round(best.tempMax)}°C`;

    bestDay = {
      date: best.date,
      weekday: best.weekdayFull,
      reason: `${best.precipitationProbability}% rain chance & ${tempText}`,
      precipProb: best.precipitationProbability,
      tempMax: Math.round(best.tempMax),
      tempMin: Math.round(best.tempMin),
      condition: best.description,
    };
  }

  return {
    tips,
    bestDay,
  };
}
