// src/services/mockData.ts
import { LoanRequest } from '../types';
import { APP_CONFIG } from '@/config/urls';
interface MockDB {
  users: {
    [key: string]: {
      id: string;
      email: string;
      userType: 'lender' | 'applicant';
      name: string;
    };
  };
  loans: {
    [key: string]: LoanRequest;
  };
  nfts: Array<{
    id: number;
    tokenId: string;
    name: string;
    type: string;
    condition: string;
    value: number;
    status: string;
    image: string;
    verificationDate: string;
  }>;
}

export const mockDB: MockDB = {
  users: {
    'lender@healthera.ai': {
      id: '1',
      email: 'lender@healthera.ai',
      userType: 'lender',
      name: 'Dr. Smith'
    },
    'applicant@healthera.ai': {
      id: '2',
      email: 'applicant@healthera.ai',
      userType: 'applicant',
      name: 'Dr. Johnson'
    }
  },
  loans: {
    '3669': {
      id: 3669,
      amount: 3669,
      purpose: "Equipment Finance",
      duration: 24,
      riskScore: 85,
      riskLevel: "Medium Risk",
      status: "Under Review",
      documents: {
        id: true,
        bank: true,
        medical: false
      },
      applicant: {
        id: '2',  // Added id field matching the user
        name: "Dr. Johnson",
        email: "applicant@healthera.ai",
        phone: "(555) 123-4567"
      },
      businessDetails: {
        tradingName: "Johnson Dental",
        businessAddress: "123 Medical St",
        mobile: "0412345678",
        principalActivity: "Dental Practice",
        yearsInBusiness: 5,
        yearsSinceTrading: 5
      },
      entityDetails: {
        type: "Individual",
        firstName: "John",
        lastName: "Johnson",
        acnAbn: "12345678901",
        trustName: "",
        trustAbn: "",
        trustType: ""
      }
    }
  },
  nfts: [
    {
      id: 1,
      tokenId: "HER-123456",
      name: "Dental X-Ray Machine",
      type: "Diagnostic Equipment",
      condition: "New",
      value: 25000,
      status: "Available",
      image: `${APP_CONFIG.apiUrl}/placeholder/400/300`,
      verificationDate: "2024-01-15"
    }
  ]
};