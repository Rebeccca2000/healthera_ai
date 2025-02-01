// src/lib/auth.ts
import { APP_CONFIG } from '@/config/urls';

export const getRedirectPath = (userType: string) => {
  const base = APP_CONFIG.baseUrl;
  return userType === 'lender' 
    ? `${base}/lender-dashboard` 
    : `${base}/applicant-dashboard`;
};

export const getCookieOptions = () => ({
  path: APP_CONFIG.baseUrl,
  secure: APP_CONFIG.isProduction,
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 24 // 24 hours
});