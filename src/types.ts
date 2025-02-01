// src/types.ts
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
    id: string;      // Added id field
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
  otherInfo?: {
      salesRepNumber: string;
      deliveryDate: string;
      mortgageAmount: number;
  };
  personalIncome?: {
      grossSalary: number;
      salaryAfterTax: number;
      contractorIncome: number;
      investmentIncome: number;
      otherIncome: number;
      taxableIncome: number;
  };
  businessIncome?: {
      revenue: number;
      abn: string;
      ebit: number;
      addbacks: number;
  };
  accountant?: {
      name: string;
      phone: string;
      email: string;
  };
}