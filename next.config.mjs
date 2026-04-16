/** @type {import('next').NextConfig} */

// `next dev --turbo` uses Turbopack; custom webpack settings are ignored and only produce noise.
const useTurboDev = process.argv.includes("--turbo");

const nextConfig = {
  webpack: (config, { dev }) => {
    if (useTurboDev) return config;
    // Webpack dev only: reduce stale chunk manifests after HMR (missing ./NNN.js, broken CSS).
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
