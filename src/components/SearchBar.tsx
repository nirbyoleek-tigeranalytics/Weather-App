import React, { useState } from 'react';
import { Search, MapPin, Loader2, Sparkles } from 'lucide-react';
import { GeoLocation } from '../types';
import { INITIAL_POPULAR_CITIES } from '../utils/constants';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
  multipleMatches: GeoLocation[];
  onSelectLocation: (location: GeoLocation) => void;
  selectedLocation: GeoLocation | null;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
  multipleMatches,
  onSelectLocation,
  selectedLocation,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim();

    if (!trimmed) {
      setValidationError('Please enter a city or location name.');
      return;
    }

    setValidationError(null);
    onSearch(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleQuickSearch = (city: string) => {
    setInputValue(city);
    setValidationError(null);
    onSearch(city);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4.5 text-slate-400 pointer-events-none">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (validationError) setValidationError(null);
            }}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Search by city (e.g., Chennai, London, Tokyo, New York)..."
            aria-label="City search input"
            aria-describedby={validationError ? 'search-validation-error' : undefined}
            className={`w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-sm transition-all focus:outline-none focus:ring-2 ${
              validationError
                ? 'border-rose-400 focus:ring-rose-400/30'
                : 'border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:ring-sky-500/20 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-medium text-sm transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            aria-label="Search city weather"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Searching</span>
              </>
            ) : (
              <span>Search</span>
            )}
          </button>
        </div>

        {/* Inline validation error message */}
        {validationError && (
          <p
            id="search-validation-error"
            role="alert"
            className="text-xs text-rose-600 dark:text-rose-400 font-medium pl-3 mt-1.5 flex items-center gap-1"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            {validationError}
          </p>
        )}
      </form>

      {/* Multiple Matches Picker List (when > 1 result returned) */}
      {multipleMatches && multipleMatches.length > 1 && (
        <div className="bg-slate-50 dark:bg-slate-900/90 border border-sky-200 dark:border-sky-900/50 rounded-2xl p-4 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Multiple locations found ({multipleMatches.length})
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Select your intended city:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {multipleMatches.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              const locationParts = [loc.admin1, loc.country].filter(Boolean).join(', ');
              return (
                <button
                  key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                  type="button"
                  onClick={() => onSelectLocation(loc)}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/10 border-sky-500 text-sky-950 dark:text-sky-100 font-medium shadow-xs'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{loc.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {locationParts || 'Location details'}
                    </div>
                  </div>
                  {isSelected && (
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-600 text-white shrink-0">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Suggested Quick Cities */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-medium text-slate-400 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Suggestions:</span>
        </span>
        {INITIAL_POPULAR_CITIES.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => handleQuickSearch(city)}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};
