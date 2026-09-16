export default () => ({
  port: 3000,
  database: {
    host: process.env.PGHOST,
    database:process.env.PGDATABASE,
    user:process.env.PGUSER,
    password:process.env.PGPASSWORD,
    url:process.env.PGDATABASE_URL
  },
  appLogs:{
    appKey:process.env.APP_TELEMETRY_KEY,
    appSecret:process.env.APP_SECRET_KEY
  },
  stripe:{
    secretKey:process.env.STRIPE_SECRET_KEY,
    webhookSecret:process.env.STRIPE_WEBHOOK_SECRET,
    currency:process.env.STRIPE_CURRENCY ?? 'usd'
  }
});