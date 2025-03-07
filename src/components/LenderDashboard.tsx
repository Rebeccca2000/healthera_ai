"use client";  // This must be the first line
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, FileText, CheckCircle, BarChart, DollarSign, Globe, TrendingUp, CircleDollarSign, Coins, Package } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import LoanDetailsModal from './LoanDetailsModal';
import { LoanRequest } from './types';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import NFTDetailsCard from './NFTDetailsCard';
import TokenTreasury from './TokenTreasury';
import { APP_CONFIG } from '@/config/urls';
// Type definitions
interface NFTDetails {
  name: string;
  tokenId: string;
  status: string;
  manufacturer: string;
  serialNumber: string;
  purchaseDate: string;
  verifier: string;
  currentValue: string;
  lastVerified: string;
  image: string;
  photos: string[];
  riskScore: string;
  history: Array<{
    action: string;
    date: string;
    type: string;
  }>;
}

interface NFTsByRequest {
  [key: number]: Array<NFTDetails>;
}

type LoanStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'UNDER REVIEW';

interface StatusBadgeProps {
  status: LoanStatus | string;
}

interface ApprovedLoan {
  id: number;
  amount: number;
  purpose: string;
  duration: number;
  dateRequested: string;
  status: LoanStatus;
  riskScore: number;
}

// NFTViewerDialog Component
interface NFTViewerDialogProps {
  requestId: number;
}
interface RiskScoreProps {
  score: number;
}

const RiskScore: React.FC<RiskScoreProps> = ({ score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`flex items-center ${getScoreColor(score)}`}>
      <TrendingUp className="h-4 w-4 mr-1" />
      <span>{score}</span>
    </div>
  );
};

const NFTViewerDialog: React.FC<NFTViewerDialogProps> = ({ requestId }) => {
  // Mock NFT data mapped by request ID
  const nftsByRequest: NFTsByRequest = {
    3669: [{
      name: "Dental X-Ray Machine",
      tokenId: "HER-123456",
      status: "Available",
      manufacturer: "DentalTech Pro",
      serialNumber: "DT-2024-789",
      purchaseDate: "2024-01-15",
      verifier: "MedEquip Certification",
      currentValue: "25,000",
      lastVerified: "2024-01-15",
      image: `${APP_CONFIG.apiUrl}/placeholder/400/300`,
      photos: [`${APP_CONFIG.apiUrl}/placeholder/200/200`, `${APP_CONFIG.apiUrl}/placeholder/200/200`],
      riskScore: "85",
      history: [
        { action: "NFT Created", date: "2024-01-15", type: "Creation" },
        { action: "Value Verified", date: "2024-01-15", type: "Verification" }
      ]
    }]
  };

  const applicantNFTs = nftsByRequest[requestId] || [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-purple-600 px-3 py-1 rounded text-sm hover:bg-purple-700">
          <Package className="w-4 h-4 mr-2 inline" />
          View NFTs ({applicantNFTs.length})
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Applicant's Equipment NFTs
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 max-h-[70vh] overflow-y-auto p-4">
          {applicantNFTs.map((nft, index) => (
            <NFTDetailsCard 
              key={index} 
              nft={nft} 
              viewMode="lender"
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
// Status Badge Component
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      case 'under review': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <span className={`${getStatusColor(status)} px-2 py-1 rounded-full text-xs font-medium uppercase`}>
      {status}
    </span>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLoan, setSelectedLoan] = useState<LoanRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
	const [theme, setTheme] = useState('dark');
	const [language, setLanguage] = useState('English');
	const { logout } = useAuth();
	const profileMenuRef = useRef<HTMLDivElement>(null);
	// Add useEffect right here, after the state declarations
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
				setIsProfileMenuOpen(false);
			}
		};
	
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const toggleProfileMenu = () => {
		setIsProfileMenuOpen(!isProfileMenuOpen);
	};
  // Add the handler functions here, right after state declarations
  const handleViewDetails = (loan: LoanRequest) => {
		console.log("Opening modal for loan:", loan);
		console.log("Before state update - isModalOpen:", isModalOpen);
		setSelectedLoan(loan);
		setIsModalOpen(true);
		console.log("After state update - isModalOpen:", isModalOpen);
	};

	const handleApprove = (id: number) => {
    // Implement approval logic
    console.log(`Approving loan ${id}`);
  };

  const handleReject = (id: number) => {
    // Implement rejection logic
    console.log(`Rejecting loan ${id}`);
  };
  
	const handleLogout = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		console.log('Logout clicked');
		logout();
		setIsProfileMenuOpen(false);
	};

  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([
    {
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
      },
      otherInfo: {
        salesRepNumber: "SR-001",
        deliveryDate: "2024-02-01",
        mortgageAmount: 500000
      },
      personalIncome: {
        grossSalary: 200000,
        salaryAfterTax: 140000,
        contractorIncome: 0,
        investmentIncome: 20000,
        otherIncome: 5000,
        taxableIncome: 225000
      },
      businessIncome: {
        revenue: 500000,
        abn: "12345678901",
        ebit: 150000,
        addbacks: 20000
      },
      accountant: {
        name: "Jane Smith",
        phone: "(555) 987-6543",
        email: "jane.smith@accounting.com"
      }
    }
  ]);
  // Enhanced metrics data
  const metrics = {
    hltaBalance: "125,000.00",
    lentFunds: "$450,000",
    recoveredFunds: "$380,000",
    globalUsers: "1,234",
    activeLoans: "45",
    successRate: "94.5%"
  };

  // Monthly lending data for chart
  const lendingData = [
    { month: 'Jan', lent: 65000, recovered: 55000 },
    { month: 'Feb', lent: 72000, recovered: 61000 },
    { month: 'Mar', lent: 85000, recovered: 70000 },
    { month: 'Apr', lent: 95000, recovered: 78000 },
    { month: 'May', lent: 102000, recovered: 85000 },
    { month: 'Jun', lent: 112000, recovered: 92000 }
  ];

  // Enhanced approved loans data
  const approvedLoans: ApprovedLoan[] = [
    {
      id: 1,
      amount: 3669,
      purpose: "Equipment Finance",
      duration: 24,
      dateRequested: "2021-12-14",
      status: "APPROVED",
      riskScore: 85
    },
    {
      id: 2,
      amount: 5200,
      purpose: "Medical Supplies",
      duration: 12,
      dateRequested: "2021-12-15",
      status: "APPROVED",
      riskScore: 92
    }
  ];

  const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusColor = (status: string): string => {
      switch (status.toLowerCase()) {
        case 'approved': return 'bg-green-500';
        case 'pending': return 'bg-yellow-500';
        case 'rejected': return 'bg-red-500';
        case 'under review': return 'bg-blue-500';
        default: return 'bg-gray-500';
      }
    };
  
    return (
      <span className={`${getStatusColor(status)} px-2 py-1 rounded-full text-xs font-medium uppercase`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gray-800 min-h-screen p-4">
        {/*new design*/}
				<div className="flex items-center mb-8">
					<div className="w-6 h-6"> {/* Made the container smaller for the plus icon */}
						<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							{/* Simple plus icon */}
							<path 
								d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z"
								fill="#8B5CF6"
							/>
						</svg>
					</div>
					<div className="ml-4"> {/* Increased margin for better spacing */}
						<h1 className="text-2xl font-bold tracking-wide"> {/* Increased size and added letter spacing */}
							<span className="text-white">Healthera</span>
							<span className="text-purple-500">.AI</span>
						</h1>
						<p className="text-sm text-gray-400 tracking-wider mt-1"> {/* Added letter spacing and margin */}
							Fast Digital Finance
						</p>
					</div>
				</div>

        <nav className="space-y-2">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'loan-requests', icon: FileText, label: 'Loan Requests' },
            { id: 'approved-requests', icon: CheckCircle, label: 'Approved Requests' },
            { id: 'token-treasury', icon: Coins, label: 'Available Funds' }
          ].map(({ id, icon: Icon, label }) => (
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
			{/* Add this near the top of your main content area */}
			<div className="absolute top-4 right-4 flex items-center">
				<div className="relative">
					<button 
						onClick={toggleProfileMenu}
						className="flex items-center space-x-3 bg-gray-800 p-2 rounded-lg hover:bg-gray-700"
					>
						<Image 
							src={`${APP_CONFIG.baseUrl}/api/placeholder/40/40`}
							alt="Profile"
							width={40}
							height={40}
							className="rounded-full"
						/>
						<span className="text-gray-200">John Doe</span>
					</button>

					{isProfileMenuOpen && (
						<div className="absolute right-0 mst-2 w-64 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
							<div className="px-4 py-3 border-b border-gray-700">
								<p className="text-sm text-gray-400">Signed in as</p>
								<p className="font-medium">john.doe@healthera.ai</p>
							</div>

							<div className="py-2">
								<button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center">
									<span className="mr-2">👤</span> Your Profile
								</button>
								<button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center">
									<span className="mr-2">⚙️</span> Settings
								</button>
								<div className="px-4 py-2 border-t border-gray-700">
									<p className="text-sm text-gray-400 mb-2">Appearance</p>
									<select 
										className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
										value={theme}
										onChange={(e) => setTheme(e.target.value)}
									>
										<option value="dark">Dark Theme</option>
										<option value="light">Light Theme</option>
										<option value="system">System Default</option>
									</select>
								</div>
								<div className="px-4 py-2 border-t border-gray-700">
									<p className="text-sm text-gray-400 mb-2">Language</p>
									<select 
										className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
										value={language}
										onChange={(e) => setLanguage(e.target.value)}
									>
										<option value="English">English</option>
										<option value="Spanish">Spanish</option>
										<option value="French">French</option>
									</select>
								</div>
							</div>

							<div className="border-t border-gray-700 pt-2">
								<button 
									className="w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400 flex items-center"
									onClick={handleLogout}
								>
									<span className="mr-2">🚪</span> Sign Out
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            {activeTab === 'approved-requests' ? 'Approved Loan Requests' : 
            activeTab === 'home' ? 'Financier Home' : 
            activeTab === 'loan-requests' ? 'Loan Requests' : 
            activeTab === 'token-treasury' ? 'Available Funds':'' 
            }
          </h2>
        </div>

        {activeTab === 'home' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[
                { title: 'HLTA Balance', value: metrics.hltaBalance, icon: DollarSign, trend: '+12%' },
                { title: 'Lent Funds', value: metrics.lentFunds, icon: CircleDollarSign, trend: '+8%' },
                { title: 'Recovered Funds', value: metrics.recoveredFunds, icon: DollarSign, trend: '+15%' },
                { title: 'Global Users', value: metrics.globalUsers, icon: Globe, trend: '+25%' },
                { title: 'Active Loans', value: metrics.activeLoans, icon: FileText, trend: '+5%' },
                { title: 'Success Rate', value: metrics.successRate, icon: CheckCircle, trend: '+2%' }
              ].map((metric, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                    <metric.icon className="h-5 w-5 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <span className="text-green-400">{metric.trend}</span>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Lending Trends Chart */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <CardHeader>
                <CardTitle>Lending Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lendingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="lent" 
                        stroke="#8B5CF6" 
                        strokeWidth={2}
                        name="Lent"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="recovered" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        name="Recovered"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}
        {activeTab === 'loan-requests' && (
          <div className="bg-gray-800 rounded-lg p-6">
            {/* Search and Filter Section */}
            <div className="flex flex-wrap gap-4 mb-6">
            <input
                type="text"
                placeholder="Search requests..."
                className="bg-gray-700 text-white rounded px-4 py-2 flex-1"
            />
            <select className="bg-gray-700 text-white rounded px-3 py-2">
                <option>All Status</option>
                <option>Pending</option>
                <option>Under Review</option>
                <option>Approved</option>
                <option>Rejected</option>
            </select>
            <select className="bg-gray-700 text-white rounded px-3 py-2">
                <option>Sort by Date</option>
                <option>Sort by Amount</option>
                <option>Sort by Risk Score</option>
            </select>
            </div>
            
            <table className="w-full">
							<thead>
								<tr className="text-left text-gray-400">
									<th className="pb-4">ID</th>
									<th className="pb-4">AMOUNT ($)</th>
									<th className="pb-4">PURPOSE</th>
									<th className="pb-4">DURATION</th>
									<th className="pb-4">RISK SCORE</th>
									<th className="pb-4">STATUS</th>
									<th className="pb-4">APPLICANT'S NFTs</th>
									<th className="pb-4">DETAILS</th>
									<th className="pb-4">ACTIONS</th>
								</tr>
							</thead>
							<tbody>
								{loanRequests.map((request) => (
									<tr key={request.id} className="border-t border-gray-700">
										<td className="py-4">#{request.id}</td>
										<td>${request.amount.toLocaleString()}</td>
										<td>{request.purpose}</td>
										<td>{request.duration} months</td>
										<td>
											<div className="flex items-center text-yellow-400">
												<span>{request.riskScore}</span>
												<span className="ml-2 text-xs">{request.riskLevel}</span>
											</div>
										</td>
										<td>
											<span className="bg-yellow-500 px-2 py-1 rounded-full text-xs">
												{request.status}
											</span>
										</td>
                    <td>
                      <NFTViewerDialog requestId={request.id} />
                    </td>
										<td>
											<button
												onClick={() => handleViewDetails(request)}
												className="bg-purple-600 px-3 py-1 rounded text-sm"
											>
												View Details
											</button>
										</td>
										<td>
											<div className="flex space-x-2">
												<button
													onClick={() => handleApprove(request.id)}
													className="bg-green-600 px-3 py-1 rounded text-sm"
												>
													Approve
												</button>
												<button
													onClick={() => handleReject(request.id)}
													className="bg-red-600 px-3 py-1 rounded text-sm"
												>
													Reject
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{/* Pagination */}
						<div className="mt-6 flex items-center justify-between">
							<div className="text-gray-400">
								Showing 1 to 10 of 24 entries
							</div>
							<div className="flex space-x-2">
								<button className="bg-gray-700 px-3 py-1 rounded">Previous</button>
								<button className="bg-purple-600 px-3 py-1 rounded">1</button>
								<button className="bg-gray-700 px-3 py-1 rounded">2</button>
								<button className="bg-gray-700 px-3 py-1 rounded">3</button>
								<button className="bg-gray-700 px-3 py-1 rounded">Next</button>
							</div>
						</div>
					</div>
				)}
        {activeTab === 'approved-requests' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <select className="bg-gray-700 text-white rounded px-3 py-2">
                  <option>10 entries per page</option>
                  <option>25 entries per page</option>
                  <option>50 entries per page</option>
                </select>
                <span className="text-gray-400">entries per page</span>
              </div>
            </div>
            
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="pb-4">AMOUNT ($)</th>
                  <th className="pb-4">PURPOSE</th>
                  <th className="pb-4">DURATION</th>
                  <th className="pb-4">DATE REQUESTED</th>
                  <th className="pb-4">RISK SCORE</th>
                  <th className="pb-4">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {approvedLoans.map((loan) => (
                  <tr key={loan.id} className="border-t border-gray-700">
                    <td className="py-4">${loan.amount}</td>
                    <td>{loan.purpose}</td>
                    <td>{loan.duration} months</td>
                    <td>{loan.dateRequested}</td>
                    <td><RiskScore score={loan.riskScore} /></td>
                    <td><StatusBadge status={loan.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'token-treasury' && <TokenTreasury />}
      </div>
			<LoanDetailsModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      loanRequest={selectedLoan}
    	/>
    </div>
  );
};


export default Dashboard;