# What to wear to work

A modern Next.js web app that tells you what clothes to wear for your bicycle commute to work, based on the weather and daylight at your location. Built with Radix UI Themes for a beautiful, accessible interface.

**🌐 Live app:** [drip.vercel.app](https://dripup.vercel.app)

## Features
- 7-day weather-based clothing recommendations for a hardcoded location (Better Developers HQ)
- Modern, accessible UI using Radix Themes
- Sunrise/sunset and weather details for each day
- Clothing icons (PNG) for each recommendation
- Toggle for dummy/real data and custom scenario testing
- Emphasized "Today" card for quick glance

## Getting Started

### 1. Clone the repository
```sh
git clone https://github.com/cowboydiver/dripup.git
cd <your-repo-directory>
```

### 2. Install dependencies
```sh
npm install
```

### 3. Run the development server
```sh
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack
- [Next.js](https://nextjs.org/) (App Router)
- [Radix UI Themes](https://themes.radix-ui.com/)
- [Open-Meteo API](https://open-meteo.com/) (weather)
- TypeScript