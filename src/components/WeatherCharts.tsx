import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, CloudRain, Thermometer } from 'lucide-react';
import { ProcessedDailyForecast } from '../types';

interface WeatherChartsProps {
  daily: ProcessedDailyForecast[];
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({ daily }) => {
  const [activeTab, setActiveTab] = useState<'both' | 'temperature' | 'precipitation'>('both');

  const chartData = daily.map((d) => ({
    name: d.weekdayShort,
    fullDate: d.formattedDate,
    'Max Temp (°C)': Math.round(d.tempMax * 10) / 10,
    'Min Temp (°C)': Math.round(d.tempMin * 10) / 10,
    'Rain Probability (%)': d.precipitationProbability,
    'Precipitation (mm)': d.precipitationSum,
    description: d.description,
  }));

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <span>Meteorological Trend Visualizer</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Interactive 7-day temperature variation and precipitation analysis
          </p>
        </div>

        {/* View Toggle */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('both')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'both'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            All Charts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('temperature')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'temperature'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Temperature
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('precipitation')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'precipitation'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Precipitation
          </button>
        </div>
      </div>

      <div className={`grid gap-6 ${activeTab === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Chart 1: Line Chart for Daily Max/Min Temperature */}
        {(activeTab === 'both' || activeTab === 'temperature') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-rose-500" />
                <span>Daily Max & Min Temperature (°C)</span>
              </span>
              <span className="text-slate-400 text-[11px]">7-Day Range</span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    unit="°"
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.92)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#f8fafc',
                      fontSize: '12px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#38bdf8', marginBottom: '4px' }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    iconType="circle"
                  />
                  <Line
                    type="monotone"
                    dataKey="Max Temp (°C)"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Min Temp (°C)"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 2: Bar Chart for Daily Precipitation Probability */}
        {(activeTab === 'both' || activeTab === 'precipitation') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-sky-500" />
                <span>Daily Precipitation Probability (%)</span>
              </span>
              <span className="text-slate-400 text-[11px]">Threshold 60%</span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    unit="%"
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.92)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#f8fafc',
                      fontSize: '12px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#38bdf8', marginBottom: '4px' }}
                    formatter={(value: any, name: any) => [
                      name === 'Rain Probability (%)'
                        ? value !== null && value !== undefined
                          ? `${value}%`
                          : 'N/A'
                        : `${value} mm`,
                      String(name ?? ''),
                    ]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    iconType="rect"
                  />
                  <ReferenceLine
                    y={60}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    label={{
                      value: 'Umbrella: 60%',
                      fill: '#f59e0b',
                      fontSize: 10,
                      position: 'insideTopRight',
                    }}
                  />
                  <Bar
                    dataKey="Rain Probability (%)"
                    fill="#0ea5e9"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
