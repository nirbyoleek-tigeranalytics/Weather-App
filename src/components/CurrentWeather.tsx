import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  MapPin,
  Calendar,
  Clock,
  Compass,
} from 'lucide-react';
import { CurrentWeatherData, GeoLocation } from '../types';
import { getWeatherInfo } from '../utils/weatherCodes';

interface CurrentWeatherProps {
  current: CurrentWeatherData;
  location: GeoLocation;
  timezone?: string;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  current,
  location,
  timezone,
}) => {
  const weatherInfo = getWeatherInfo(current.weather_code);
  const locationSubtitle = [location.admin1, location.country].filter(Boolean).join(', ');

  // Format local observation time if possible
  const localTimeString = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
    timeZoneName: 'short',
  });

  const localDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    timeZone: timezone,
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 text-white p-6 sm:p-8 shadow-xl shadow-sky-950/10 transition-all">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/15">
        {/* Left: Location & Time details */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium text-sky-100">
            <MapPin className="w-3.5 h-3.5 text-sky-300" />
            <span>Currently Observing</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>{location.name}</span>
            {location.country_code && (
              <span className="text-xl font-semibold text-sky-200/80">
                ({location.country_code})
              </span>
            )}
          </h2>

          <p className="text-sm sm:text-base text-sky-100/90 font-medium">
            {locationSubtitle || 'World Meteorological Observation'}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-sky-200/80 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{localDateString}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{localTimeString}</span>
            </span>
            {timezone && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span className="font-mono">{timezone}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Primary Temperature and Condition Badge */}
        <div className="flex items-center gap-5 sm:gap-7 bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/15">
          <div className="text-5xl sm:text-6xl select-none" aria-hidden="true">
            {weatherInfo.emoji}
          </div>
          <div>
            <div className="flex items-baseline">
              <span className="text-5xl sm:text-6xl font-black tracking-tight leading-none">
                {Math.round(current.temperature_2m)}
              </span>
              <span className="text-2xl sm:text-3xl font-light text-sky-200 ml-1">°C</span>
            </div>
            <div className="text-base sm:text-lg font-semibold text-sky-100 mt-1">
              {weatherInfo.description}
            </div>
            <div className="text-xs text-sky-200/90 flex items-center gap-1 mt-0.5">
              <span>WMO Code:</span>
              <span className="font-mono bg-white/20 px-1.5 py-0.2 rounded text-[11px] font-bold">
                {current.weather_code}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Meteorological Metrics */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 pt-6">
        {/* Feels Like */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-white/15 text-sky-200 shrink-0">
            <Thermometer className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-sky-200 uppercase tracking-wider">
              Feels Like
            </p>
            <p className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5 truncate">
              {Math.round(current.apparent_temperature)}°C
            </p>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-white/15 text-sky-200 shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-sky-200 uppercase tracking-wider">
              Humidity
            </p>
            <p className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5 truncate">
              {Math.round(current.relative_humidity_2m)}%
            </p>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-white/15 text-sky-200 shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-sky-200 uppercase tracking-wider">
              Wind Speed
            </p>
            <p className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5 truncate">
              {Math.round(current.wind_speed_10m)} <span className="text-xs font-normal text-sky-200">km/h</span>
            </p>
          </div>
        </div>

        {/* Precipitation */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-white/15 text-sky-200 shrink-0">
            <CloudRain className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-sky-200 uppercase tracking-wider">
              Precipitation
            </p>
            <p className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5 truncate">
              {current.precipitation} <span className="text-xs font-normal text-sky-200">mm</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
