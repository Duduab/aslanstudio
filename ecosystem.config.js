/**
 * PM2 — Next.js studio-booking (`npm start` → `next start`).
 *
 * First time on the VPS (from the app root, same folder as this file):
 *   npm install --frozen-lockfile && npm run build
 *   pm2 start ecosystem.config.js --only studio-booking-app --env production
 *   pm2 save && pm2 startup
 *
 * @see https://pm2.keymetrics.io/docs/usage/application-declaration/
 */
module.exports = {
  apps: [
    {
      name: "studio-booking-app",
      cwd: __dirname,
      script: "npm",
      args: "run start -- -H 0.0.0.0 -p 3000",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      min_uptime: "10s",
      max_restarts: 10,
      time: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
