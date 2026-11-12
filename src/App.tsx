/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CloudSun,
  Loader2,
  Compass,
  Sparkles,
  MapPin,
  RefreshCw,
  Sun,
  Moon,
} from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { ForecastCards } from './components/ForecastCards';
import { WeatherCharts } from './components/WeatherCharts';
import { Recommendations } from './components/Recommendations';
import { ErrorMessage } from './components/ErrorMessage';
import {
  fetchWeatherForecast,
  processDailyData,
  searchCities,
  WeatherApiError,
} from './services/weatherApi';
import { generateRecommendations } from './utils/recommendations';
import {
  GeoLocation,
  ProcessedDailyForecast,
  RecommendationSummary,
  WeatherApiResponse,
} from './types';

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<GeoLocation | null>(null);
  const [multipleMatches, setMultipleMatches] = useState<GeoLocation[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [processedDaily, setProcessedDaily] = useState<ProcessedDailyForecast[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationSummary | null>(null);
  const [lastQuery, setLastQuery] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCityNotFound, setIsCityNotFound] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Toggle dark class on root document
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  /**
   * Search for city and immediately fetch forecast for results[0] by default.
   * If multiple matches exist, also offer them for the user to pick.
   */
  const handleSearch = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setLastQuery(trimmed);
    setIsLoading(true);
    setErrorMessage(null);
    setIsCityNotFound(false);

    try {
      const locations = await searchCities(trimmed);

      // Store multiple matches if > 1
      if (locations.length > 1) {
        setMultipleMatches(locations);
      } else {
        setMultipleMatches([]);
      }

      // Use results[0] by default as required by specification
      const primaryLoc = locations[0];
      await loadWeatherForLocation(primaryLoc);
    } catch (err: any) {
      setIsLoading(false);
      if (err instanceof WeatherApiError && err.isCityNotFound) {
        setIsCityNotFound(true);
        setErrorMessage('City not found. Check the spelling and try again.');
      } else {
        setIsCityNotFound(false);
        setErrorMessage(
          err.message || 'Unable to communicate with the weather service. Please try again.'
        );
      }
    }
  };

  /**
   * Fetch weather forecast for a selected location coordinates
   */
  const loadWeatherForLocation = async (location: GeoLocation) => {
    setSelectedLocation(location);
    setIsLoading(true);
    setErrorMessage(null);
    setIsCityNotFound(false);

    try {
      const data = await fetchWeatherForecast(location.latitude, location.longitude);
      setWeatherData(data);

      const daily = processDailyData(data.daily, data.timezone);
      setProcessedDaily(daily);

      const recs = generateRecommendations(daily);
      setRecommendations(recs);
    } catch (err: any) {
      if (err instanceof WeatherApiError && err.isCityNotFound) {
        setIsCityNotFound(true);
        setErrorMessage('City not found. Check the spelling and try again.');
      } else {
        setIsCityNotFound(false);
        setErrorMessage(
          err.message || 'Failed to retrieve meteorological data. Please retry.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (selectedLocation) {
      loadWeatherForLocation(selectedLocation);
    } else if (lastQuery) {
      handleSearch(lastQuery);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200 antialiased`}>
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-600 text-white shadow-sm shadow-sky-600/30">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-slate-50">
                Weather Intelligence
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Open-Meteo Synoptic Forecasting & Decision Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedLocation && !isLoading && (
              <button
                type="button"
                onClick={() => loadWeatherForLocation(selectedLocation)}
                title="Refresh current weather data"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle color theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Search Bar Section */}
        <section aria-label="City search section">
          <SearchBar
            onSearch={handleSearch}
            isLoading={isLoading}
            multipleMatches={multipleMatches}
            onSelectLocation={loadWeatherForLocation}
            selectedLocation={selectedLocation}
          />
        </section>

        {/* Error or Not Found Display */}
        {errorMessage && (
          <ErrorMessage
            message={errorMessage}
            isCityNotFound={isCityNotFound}
            onRetry={handleRetry}
            onClear={() => setErrorMessage(null)}
          />
        )}

        {/* Loading State Spinner */}
        {isLoading && !weatherData && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin" />
              <CloudSun className="w-6 h-6 text-sky-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">
              Retrieving meteorological observations...
            </p>
          </div>
        )}

        {/* Initial Empty State (Inviting the user to search) */}
        {!weatherData && !isLoading && !errorMessage && (
          <div className="text-center py-16 sm:py-24 px-4 max-w-xl mx-auto space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm">
              <CloudSun className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Explore Real-Time Weather Intelligence
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Enter any city worldwide to get instant live conditions, 7-day synoptic outlooks,
                interactive trend charts, and deterministic planning advisories.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleSearch('Chennai')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 font-medium text-sm text-slate-800 dark:text-slate-200 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-sky-500" />
                <span>Try Chennai, India</span>
              </button>
              <button
                type="button"
                onClick={() => handleSearch('London')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 font-medium text-sm text-slate-800 dark:text-slate-200 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-sky-500" />
                <span>Try London, UK</span>
              </button>
            </div>
          </div>
        )}

        {/* Weather Dashboard (When data is present) */}
        {weatherData && selectedLocation && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. Current Weather Card */}
            <CurrentWeather
              current={weatherData.current}
              location={selectedLocation}
              timezone={weatherData.timezone}
            />

            {/* 2. Planning Recommendations (3-5 tips + best day of the week) */}
            {recommendations && (
              <Recommendations data={recommendations} />
            )}

            {/* 3. 7-Day Forecast Cards */}
            {processedDaily.length > 0 && (
              <ForecastCards daily={processedDaily} />
            )}

            {/* 4. Weather Charts (Recharts: Line chart of Max/Min Temp & Bar chart of Precip Prob) */}
            {processedDaily.length > 0 && (
              <WeatherCharts daily={processedDaily} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Weather Intelligence App • Data provided by{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-sky-600 dark:text-sky-400 underline underline-offset-2 hover:text-sky-500"
            >
              Open-Meteo
            </a>{' '}
            (No API Key required)
          </p>
          <p className="text-[11px] text-slate-400">
            Metric Units: °C • km/h • mm • %
          </p>
        </div>
      </footer>
    </div>
  );
}
