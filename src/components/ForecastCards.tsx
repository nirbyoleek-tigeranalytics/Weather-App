import React from 'react';
import { CloudRain, Sun, ArrowUp, ArrowDown } from 'lucide-react';
import { ProcessedDailyForecast } from '../types';
import { getWeatherInfo } from '../utils/weatherCodes';

interface ForecastCardsProps {
  daily: ProcessedDailyForecast[];
}

export const ForecastCards: React.FC<ForecastCardsProps> = ({ daily }) => {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <span>7-Day Synoptic Outlook</span>
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          7 days daily forecast
        </span>
      </div>

      {/* Responsive Grid wrapping cleanly across all screen sizes (1 col on 360px, 2-3 on tablet, 7 on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {daily.map((day, idx) => {
          const info = getWeatherInfo(day.weatherCode);
          const isToday = idx === 0;

          return (
            <div
              key={day.date}
              className={`flex flex-col justify-between p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                isToday
                  ? 'bg-sky-50/80 dark:bg-sky-950/30 border-sky-300 dark:border-sky-800 ring-1 ring-sky-400/30 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Header: Day name + badge */}
              <div className="text-center pb-2 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {day.weekdayShort}
                  </span>
                  {isToday && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-sky-600 text-white leading-none">
                      Today
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  {day.formattedDate}
                </div>
              </div>

              {/* Icon and condition description */}
              <div className="py-3 text-center flex flex-col items-center">
                <div className="text-3xl select-none mb-1.5" aria-hidden="true">
                  {info.emoji}
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-2 h-8 flex items-center justify-center">
                  {day.description}
                </p>
              </div>

              {/* Temperatures: Max / Min */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="inline-flex items-center text-rose-600 dark:text-rose-400 font-bold">
                    <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                    <span>{Math.round(day.tempMax)}°</span>
                  </span>
                  <span className="inline-flex items-center text-blue-600 dark:text-blue-400 font-bold">
                    <ArrowDown className="w-3 h-3 stroke-[2.5]" />
                    <span>{Math.round(day.tempMin)}°</span>
                  </span>
                </div>

                {/* Rain probability */}
                <div className="flex items-center justify-between text-[11px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1 text-slate-500">
                    <CloudRain className="w-3 h-3 text-sky-500" />
                    <span>Rain</span>
                  </span>
                  <span
                    className={`font-bold ${
                      day.precipitationProbability >= 50
                        ? 'text-sky-600 dark:text-sky-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {day.precipitationProbability}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
