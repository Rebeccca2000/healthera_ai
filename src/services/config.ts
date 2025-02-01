// src/services/config.ts
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/healthera_ai/api',
  IS_MOCK: process.env.NODE_ENV === 'development',
  AUTH_TOKEN_KEY: 'healthera_auth_token',
  USER_KEY: 'healthera_user'
};