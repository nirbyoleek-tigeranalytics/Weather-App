# Weather Intelligence App

A sleek, responsive, client-side single-page meteorological intelligence application built with React, Vite, TypeScript, and Tailwind CSS. Powered entirely by the public [Open-Meteo](https://open-meteo.com/) APIs with zero API keys or server-side dependencies.

## Features

- **Global Geocoding & Multi-Match Disambiguation**: Search any city worldwide with instant lookup. When multiple regions share the same name (e.g., London, UK vs. London, Ontario), seamlessly choose the exact location.
- **Real-Time Conditions**: Temperature, feels-like, humidity, wind velocity, precipitation amount, and WMO weather condition code mapping with visual status badges.
- **7-Day Synoptic Forecast**: Day-by-day temperature extremes, rain probability percentages, precipitation accumulation, and conditions.
- **Visual Meteorological Charts**: Interactive Recharts graphs tracking daily maximum & minimum temperatures alongside daily precipitation probabilities.
- **Rule-Based Planning Recommendations**: Deterministic outdoor intelligence tips (umbrella alerts, UV protection advisories, hydration/heat warnings, thermal layer guidance, wind warnings) plus calculation of the single **Best Day of the Week** for outdoor pursuits.
- **Resilient Offline/Error States**: Handles unknown cities, network anomalies, and offers one-click retry.

---

## Local Development & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000` (or the port specified by Vite).

### 3. Build for Production
```bash
npm run build
```
This generates a production-optimized, static bundle inside the `dist/` folder.

---

## Deploying to Cloudflare Pages

This application is built as a pure client-side SPA with zero server dependencies, making it optimal for static CDN hosting like Cloudflare Pages.

### Configuration Settings
- **Framework preset**: `Vite` (or `None`)
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (project root)
- **Environment variables**: None required (all public APIs)

The SPA fallback routing is pre-configured via `/public/_redirects`:
```text
/* /index.html 200
```
This guarantees deep links and client routing resolve cleanly without 404 errors.
