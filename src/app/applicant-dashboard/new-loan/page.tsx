'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoanApplicationFlow from '@/components/LoanApplicationFlow';
import { APP_CONFIG } from '@/config/urls';
export default function NewLoanPage() {
  const { isAuthenticated, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || userRole !== 'applicant') {
      router.push(`${APP_CONFIG.baseUrl}/`);
    }
  }, [isAuthenticated, userRole, router]);

  if (!isAuthenticated || userRole !== 'applicant') {
    return null;
  }

  return <LoanApplicationFlow />;
}