# Bicycle Commute Clothing Recommendation App

A modern Next.js web app that tells you what clothes to wear on your bicycle commute, based on weather and daylight at your commute time and location. Built with Radix UI Themes for a beautiful, accessible interface.

## Features
- Enter your location and commute time
- Real-time weather and daylight data (Open-Meteo API)
- Geocoding for street addresses (OpenCage API)
- Clothing recommendations for your bicycle commute
- Modern, accessible UI with Radix Themes

## Getting Started

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd <your-repo-directory>
```

### 2. Install dependencies
```sh
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the project root:
```env
OPENCAGE_API_KEY=your_opencage_api_key
```

### 4. Run the development server
```sh
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables
- `OPENCAGE_API_KEY`: Your [OpenCage Geocoding API](https://opencagedata.com/) key for address lookup.

## Tech Stack
- [Next.js](https://nextjs.org/) (App Router)
- [Radix UI Themes](https://themes.radix-ui.com/)
- [Open-Meteo API](https://open-meteo.com/) (weather)
- [OpenCage API](https://opencagedata.com/) (geocoding)
- TypeScript

## License
MIT

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
