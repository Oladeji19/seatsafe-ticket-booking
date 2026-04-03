import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string, fallback?: string) {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  port: Number(requireEnv('PORT', '4000')),
  clientOrigin: requireEnv('CLIENT_ORIGIN', 'http://localhost:5173'),
  databaseUrl: requireEnv('DATABASE_URL'),
  jwtSecret: requireEnv('JWT_SECRET', 'dev_secret_change_me')
};
