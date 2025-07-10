import dotenv from 'dotenv';

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/defaultdb',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'fallback-cookie-secret',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:8080'
};