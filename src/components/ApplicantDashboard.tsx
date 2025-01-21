// src/components/ApplicantDashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, FileText, Package, DollarSign, Clock, Globe, Wallet, Plus, CreditCard} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';  // Add this import at the top
import Image from 'next/image';
import ApplicantLoansManager from '@/components/ApplicantLoansManager';
import NFTMintingFlow from '@/components/NFTMintingFlow';
import LoanApplicationFlow from '@/components/LoanApplicationFlow';
import NFTGallery from '@/components/NFTGallery';

const ApplicantDashboard = () => {
  const router = useRouter();  // Add this line before other state declarations
  const [activeTab, setActiveTab] = useState('home');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sample metrics for the applicant dashboard
  const metrics = {
    activeLoans: "1",
    totalBorrowed: "$3,669",
    nextPayment: "$180",
    paymentDate: "Feb 15, 2024",
    equipmentValue: "$4,500",
    nftCount: "2",
    assetValue: "$8,500",  // Total value of NFTs
    creditScore: "85"
  };

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/applicant-dashboard' },
    { id: 'nfts', icon: Package, label: 'My NFTs', path: '/applicant-dashboard/nfts' },
    { id: 'loans', icon: FileText, label: 'My Loans', path: '/applicant-dashboard/loans' },
    { id: 'mint-nft', icon: Plus, label: 'Mint New NFTs', path: '/applicant-dashboard/mint-nft' },
    { id: 'new-loan', icon: DollarSign, label: 'New Loan Application', path: '/applicant-dashboard/new-loan' },
    { id: 'payments', icon: CreditCard, label: 'Payments', path: '/applicant-dashboard/payments' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gray-800 min-h-screen p-4">
        <div className="flex items-center mb-8">
          <div className="w-6 h-6">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z"
                fill="#8B5CF6"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">
              <span className="text-white">Healthera</span>
              <span className="text-purple-500">.AI</span>
            </h1>
            <p className="text-sm text-gray-400">Applicant Portal</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigationItems.map(({ id, icon: Icon, label }) => (
            <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
              activeTab === id ? 'bg-purple-600' : 'hover:bg-gray-700'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
          {activeTab === 'home' ? 'Welcome Back' :
            activeTab === 'nfts' ? 'My NFTs' :
            activeTab === 'loans' ? 'My Loans' :
            activeTab === 'mint-nft' ? 'Mint New NFTs' :
            activeTab === 'new-loan' ? 'New Loan Application' :
            'Payments'}
          </h2>

          {/* Profile Menu */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-3 bg-gray-800 p-2 rounded-lg hover:bg-gray-700"
            >
              <Image 
                src="/healthera_ai/api/placeholder/40/40"
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-gray-200">Dr. Smith</span>
            </button>

            {isProfileMenuOpen && (
              <div ref={profileMenuRef} className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-700">Profile</button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-700">Settings</button>
                <button 
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {activeTab === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Active Loans', value: metrics.activeLoans, icon: FileText },
              { title: 'Total Borrowed', value: metrics.totalBorrowed, icon: DollarSign },
              { title: 'Next Payment', value: metrics.nextPayment, icon: Clock },
              { title: 'Payment Due', value: metrics.paymentDate, icon: Globe },
              { title: 'Equipment Value', value: metrics.equipmentValue, icon: Package },
              { title: 'NFT Assets', value: metrics.nftCount, icon: Wallet },
              { title: 'Credit Score', value: metrics.creditScore, icon: DollarSign }
            ].map((metric, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <metric.icon className="h-5 w-5 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'mint-nft' && (
          <NFTMintingFlow />
        )}

        {activeTab === 'new-loan' && (
          <LoanApplicationFlow />
        )}

        {activeTab === 'loans' && (
          <div className="w-full">
            <ApplicantLoansManager />
          </div>
        )}
        {activeTab === 'nfts' && <NFTGallery />}

        {activeTab === 'payments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Next Payment</span>
                  <Clock className="h-5 w-5 text-purple-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold">{metrics.nextPayment}</p>
                    <p className="text-sm text-gray-400">Due on {metrics.paymentDate}</p>
                  </div>
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
                    Make Payment
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Payment History</span>
                  <FileText className="h-5 w-5 text-purple-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { date: 'Jan 15, 2025', amount: '$180', status: 'Paid' },
                    { date: 'Dec 15, 2024', amount: '$180', status: 'Paid' },
                    { date: 'Nov 15, 2024', amount: '$180', status: 'Paid' },
                  ].map((payment, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium">{payment.date}</p>
                        <p className="text-sm text-gray-400">{payment.amount}</p>
                      </div>
                      <Badge className="bg-green-600">{payment.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Payment Methods</span>
                  <DollarSign className="h-5 w-5 text-purple-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-700 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <DollarSign className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">Bank Account</p>
                        <p className="text-sm text-gray-400">****1234</p>
                      </div>
                    </div>
                    <Badge>Default</Badge>
                  </div>
                  <button className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600">
                    Add Payment Method
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantDashboard;