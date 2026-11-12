import React from 'react';
import {
  Compass,
  Umbrella,
  Flame,
  Snowflake,
  Sun,
  Wind,
  CheckCircle2,
  CalendarCheck2,
  Sparkles,
  Info,
} from 'lucide-react';
import { RecommendationSummary, RecommendationTip } from '../types';

interface RecommendationsProps {
  data: RecommendationSummary;
}

export const Recommendations: React.FC<RecommendationsProps> = ({ data }) => {
  const { tips, bestDay } = data;

  const renderIcon = (type: RecommendationTip['type']) => {
    switch (type) {
      case 'umbrella':
        return <Umbrella className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
      case 'heat':
        return <Flame className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'cold':
        return <Snowflake className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'uv':
        return <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'wind':
        return <Wind className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'pleasant':
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  const getCardStyle = (severity: RecommendationTip['severity']) => {
    switch (severity) {
      case 'alert':
        return 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100';
      case 'caution':
        return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-950 dark:text-indigo-100';
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100';
      default:
        return 'bg-sky-500/10 border-sky-500/30 text-sky-950 dark:text-sky-100';
    }
  };

  return (
    <div className="space-y-4">
      {/* Best Day of the Week Highlight Banner */}
      {bestDay && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-5 sm:p-6 shadow-md shadow-emerald-900/10">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold text-emerald-100 tracking-wide uppercase">
                <CalendarCheck2 className="w-3.5 h-3.5" />
                <span>Prime Outdoor Activity Day</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>{bestDay.weekday} is the best day for outdoor plans</span>
              </h3>
              <p className="text-sm text-emerald-100/90 leading-relaxed">
                Evaluated across the 7-day forecast with the lowest precipitation probability ({bestDay.precipProb}%)
                and mildest comfort temperature ({bestDay.tempMax}°C max).
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 bg-white/15 px-4 py-2.5 rounded-2xl border border-white/20">
              <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider">
                Conditions
              </span>
              <span className="text-sm font-bold text-white">
                {bestDay.condition} • {bestDay.tempMin}° / {bestDay.tempMax}°C
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Rule-Based Planning Recommendations */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <span>Rule-Based Outdoor Intelligence</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Deterministic Rules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className={`rounded-2xl border p-4.5 transition-all duration-150 flex items-start gap-3.5 ${getCardStyle(
                tip.severity
              )}`}
            >
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 shadow-2xs shrink-0 mt-0.5">
                {renderIcon(tip.type)}
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm sm:text-base leading-snug">
                    {tip.message}
                  </h4>
                </div>

                <p className="text-xs opacity-90 leading-relaxed">
                  {tip.detail}
                </p>

                <div className="pt-1 flex items-center gap-1.5 text-[11px] font-mono opacity-75">
                  <Info className="w-3 h-3" />
                  <span>Rule: {tip.rule}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
