export interface LoanRequest {
  id: number;
  amount: number;
  purpose: string;
  duration: number;
  riskScore: number;
  riskLevel: string;
  status: string;
  documents: {
    id: boolean;
    bank: boolean;
    medical: boolean;
  };
  applicant: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  businessDetails: {
    tradingName: string;
    businessAddress: string;
    mobile: string;
    principalActivity: string;
    yearsInBusiness: number;
    yearsSinceTrading: number;
  };
  entityDetails: {
    type: string;
    firstName: string;
    lastName: string;
    acnAbn: string;
    trustName: string;
    trustAbn: string;
    trustType: string;
  };
  // ... rest of the interface
} 