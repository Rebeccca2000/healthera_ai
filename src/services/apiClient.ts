// src/services/apiClient.ts
import { API_CONFIG } from './config';
import { mockDB } from './mockData';
import { APP_CONFIG } from '@/config/urls';
interface NFTData {
  userId?: string;
  equipmentName: string;
  equipmentType: string;
  description: string;
  images: {
    frontView: string | null;
    sideView: string | null;
  };
  status?: string;
}

interface LoanData {
  amount: number;
  purpose: string;
  duration: number;
  applicant: {
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
}

class ApiClient {
  private static instance: ApiClient;
  private token: string | null = null;

  private constructor() {
    // Only access localStorage in the browser
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(API_CONFIG.AUTH_TOKEN_KEY);
    }
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private getStorageItem(key: string): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setStorageItem(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  private removeStorageItem(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    if (API_CONFIG.IS_MOCK) {
      return this.mockRequest(endpoint, options);
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers
    };

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  private async mockRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));

    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : undefined;

    switch (`${method} ${endpoint}`) {
      case 'POST /auth/login': {
        const { email, password } = body;
        const user = mockDB.users[email];
        
        if (!user) {
          throw new Error('Invalid credentials');
        }

        // In development, accept any password
        return {
          user: {
            id: user.id,
            email: user.email,
            type: user.userType
          }
        } as T;
      }

      case 'POST /auth/logout':
        return { success: true } as T;

      case 'GET /loans':
        return Object.values(mockDB.loans) as T;

      case 'GET /nfts':
        return mockDB.nfts as T;

      case 'POST /nfts': {
        const newNFT = {
          id: Date.now(),
          tokenId: `HER-${Date.now().toString().slice(-6)}`,
          ...body,
          status: 'Pending'
        };
        mockDB.nfts.push(newNFT);
        return newNFT as T;
      }

      case 'POST /loans': {
        const newLoan = {
          id: Date.now(),
          status: 'Pending',
          ...body
        };
        mockDB.loans[newLoan.id] = newLoan;
        return newLoan as T;
      }

      default:
        console.warn(`No mock handler for ${method} ${endpoint}`);
        return null as T;
    }
  }

  // Auth Methods
  async login(email: string, password: string) {
    const response = await this.request<{
      user: {
        id: string;
        type: string;
        email: string;
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (response?.user) {
      this.token = 'mock_token_' + Date.now();
      this.setStorageItem(API_CONFIG.AUTH_TOKEN_KEY, this.token);
      this.setStorageItem(API_CONFIG.USER_KEY, JSON.stringify(response.user));
    }

    return response;
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST'
    });
    
    this.token = null;
    this.removeStorageItem(API_CONFIG.AUTH_TOKEN_KEY);
    this.removeStorageItem(API_CONFIG.USER_KEY);
    
    return response;
  }

  // NFT Methods
  async getNFTs(userId: string) {
    return this.request(`/nfts?userId=${userId}`);
  }

  async createNFT(nftData: NFTData) {
    return this.request<NFTData>('/nfts', {
      method: 'POST',
      body: JSON.stringify(nftData)
    });
  }

  // Loan Methods
  async getLoanRequests() {
    return this.request('/loans');
  }

  async createLoan(loanData: LoanData) {
    return this.request<LoanData>('/loans', {
      method: 'POST',
      body: JSON.stringify(loanData)
    });
  }
}

export const apiClient = ApiClient.getInstance();

export const mintNFT = async (data: {
  userId?: string;
  equipmentName: string;
  equipmentType: string;
  description: string;
  images: {
    frontView: string | null;
    sideView: string | null;
  };
}) => {
  const response = await fetch(`${APP_CONFIG.apiUrl}/api/nfts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to mint NFT');
  }

  return response.json();
};
