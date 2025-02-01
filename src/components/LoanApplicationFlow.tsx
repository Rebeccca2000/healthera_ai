import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { APP_CONFIG } from '@/config/urls';
import { 
  Package,  
  Calculator, 
  FileCheck, 
  AlertTriangle,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogClose, 
  DialogTrigger 
} from "@/components/ui/dialog";
import Image from 'next/image';

interface NFT {
  id: number;
  tokenId: string;
  name: string;
  type: string;
  condition: string;
  value: number;
  status: string;
  image: string;
  verificationDate: string;
}

const LoanApplicationFlow: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [loanTerms, setLoanTerms] = useState({
    amount: '',
    duration: '12',
    interestRate: '6.99',
    monthlyPayment: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Sample NFTs data - in real app, this would come from an API
  const availableNFTs: NFT[] = [
    {
      id: 1,
      tokenId: 'HER-123456',
      name: 'Medical Scanner XR-500',
      type: 'Diagnostic Equipment',
      condition: 'New',
      value: 25000,
      status: 'Available',
      image: `${APP_CONFIG.apiUrl}/placeholder/400/300`,
      verificationDate: '2024-01-15'
    },
    {
      id: 2,
      tokenId: 'HER-789012',
      name: 'Dental Chair Pro',
      type: 'Treatment Equipment',
      condition: 'New',
      value: 15000,
      status: 'Available',
      image: `${APP_CONFIG.apiUrl}/placeholder/400/300`,
      verificationDate: '2024-01-20'
    }
  ];

  const calculateLoan = useCallback(() => {
    const amount = parseFloat(loanTerms.amount);
    const rate = parseFloat(loanTerms.interestRate) / 100 / 12;
    const duration = parseInt(loanTerms.duration);
    
    if (amount && rate && duration) {
      const payment = (amount * rate * Math.pow(1 + rate, duration)) / (Math.pow(1 + rate, duration) - 1);
      setLoanTerms(prev => ({
        ...prev,
        monthlyPayment: payment.toFixed(2)
      }));
    }
  }, [loanTerms.amount, loanTerms.interestRate, loanTerms.duration]);
  // Update the Dialog part with API integration:
  const handleLoanSubmission = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const loanData = {
        applicantId: user?.id,
        amount: parseFloat(loanTerms.amount),
        purpose: "Equipment Finance",
        equipmentDetails: {
          name: selectedNFT?.name,
          description: `${selectedNFT?.type} - ${selectedNFT?.condition}`,
          value: selectedNFT?.value
        }
      };

      const response = await fetch(`${APP_CONFIG.apiUrl}/loans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loanData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit loan application');
      }

      const data = await response.json();
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error submitting loan:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {['Select NFT', 'Loan Terms', 'Final Review'].map((label, index) => (
          <div key={label} className="flex flex-col items-center w-1/3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
              ${step > index + 1 ? 'bg-green-500' : step === index + 1 ? 'bg-purple-600' : 'bg-gray-700'}`}>
              {step > index + 1 ? '✓' : index + 1}
            </div>
            <span className="text-sm text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Step 1: NFT Selection */}
      {step === 1 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-400" />
              Select Collateral NFT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4">
                {availableNFTs.map((nft) => (
                  <div
                    key={nft.id}
                    className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                      selectedNFT?.id === nft.id 
                        ? 'border-purple-500 bg-purple-900/20' 
                        : 'border-gray-700 bg-gray-700 hover:border-purple-500'
                    }`}
                    onClick={() => setSelectedNFT(nft)}
                  >
                    <div className="flex items-start gap-4">
                      <Image 
                        src={nft.image} 
                        alt={nft.name}
                        width={96}
                        height={96}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{nft.name}</h3>
                            <p className="text-sm text-gray-400">Token ID: {nft.tokenId}</p>
                          </div>
                          <Badge className="bg-green-600">{nft.status}</Badge>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-400">Estimated Value</p>
                            <p className="font-medium">${nft.value.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Last Verified</p>
                            <p className="font-medium">{nft.verificationDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {availableNFTs.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No NFTs Available</h3>
                  <p className="text-gray-400">You need to mint NFTs before applying for a loan.</p>
                  <Button 
                    className="mt-4 bg-purple-600 hover:bg-purple-700"
                    onClick={() => window.location.href = '/applicant-dashboard/mint-nft'}
                  >
                    Mint New NFT
                  </Button>
                </div>
              )}

              <Alert className="bg-purple-900/50 border border-purple-500">
                <AlertTriangle className="h-5 w-5 text-purple-400" />
                <AlertDescription>
                  The selected NFT will be locked in a smart contract as collateral until the loan is fully repaid.
                </AlertDescription>
              </Alert>

              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => setStep(2)}
                disabled={!selectedNFT}
              >
                Continue to Loan Terms
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Loan Terms */}
      {step === 2 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-purple-400" />
              Loan Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-700 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Selected NFT</p>
                    <p className="font-medium">{selectedNFT?.name}</p>
                    <p className="text-sm text-gray-400">Token ID: {selectedNFT?.tokenId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Collateral Value</p>
                    <p className="font-medium">${selectedNFT?.value.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Loan Amount ($)</label>
                  <input
                    type="number"
                    className="w-full bg-gray-700 border-gray-600 rounded-lg p-2"
                    value={loanTerms.amount}
                    onChange={(e) => {
                      const newAmount = e.target.value;
                      setLoanTerms(prev => ({ ...prev, amount: newAmount }));
                      calculateLoan();
                    }}
                    placeholder="Enter loan amount"
                    max={selectedNFT?.value}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Loan Duration</label>
                  <select
                    className="w-full bg-gray-700 border-gray-600 rounded-lg p-2"
                    value={loanTerms.duration}
                    onChange={(e) => {
                      setLoanTerms(prev => ({ ...prev, duration: e.target.value }));
                      calculateLoan();
                    }}
                  >
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Interest Rate</p>
                    <p className="text-2xl font-bold">{loanTerms.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Monthly Payment</p>
                    <p className="text-2xl font-bold">
                      ${loanTerms.monthlyPayment || '0.00'}
                    </p>
                  </div>
                </div>
              </div>

              <Alert className="bg-purple-900/50 border border-purple-500">
                <AlertTriangle className="h-5 w-5 text-purple-400" />
                <AlertDescription>
                  Loan amount cannot exceed {selectedNFT?.value ? `$${selectedNFT.value.toLocaleString()}` : '0'} based on the NFT&apos;s verified value.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-gray-700 hover:bg-gray-600"
                  onClick={() => setStep(1)}
                >
                  Back to NFT Selection
                </Button>
                <Button 
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={() => setStep(3)}
                  disabled={!loanTerms.amount || !loanTerms.duration}
                >
                  Continue to Review
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Final Review */}
      {step === 3 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-purple-400" />
              Review Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Collateral Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">NFT</p>
                    <p>{selectedNFT?.name}</p>
                    <p className="text-sm text-gray-400 mt-1">Token ID: {selectedNFT?.tokenId}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Verified Value</p>
                    <p>${selectedNFT?.value.toLocaleString()}</p>
                    <p className="text-sm text-gray-400 mt-1">as of {selectedNFT?.verificationDate}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Loan Terms</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Loan Amount</p>
                    <p>${parseFloat(loanTerms.amount).toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Duration</p>
                    <p>{loanTerms.duration} months</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Interest Rate</p>
                    <p>{loanTerms.interestRate}% APR</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Monthly Payment</p>
                    <p>${loanTerms.monthlyPayment}</p>
                  </div>
                </div>
              </div>

              <Alert className="bg-purple-900/50 border border-purple-500">
                <AlertTriangle className="h-5 w-5 text-purple-400" />
                <AlertDescription>
                  By submitting this application, you agree to use your NFT as collateral
                  for this loan. The NFT will be locked in a smart contract until the loan is fully repaid.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-gray-700 hover:bg-gray-600"
                  onClick={() => setStep(2)}
                >
                  Back to Loan Terms
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700"
                    onClick={handleLoanSubmission}
                    >
                      Submit Application
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 border-gray-700 text-white">
                    <div className="text-center p-6">
                      <div className="w-12 h-12 rounded-full bg-green-500 mx-auto mb-4 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <DialogTitle className="text-xl font-semibold mb-4">
                        Application Submitted Successfully!
                      </DialogTitle>
                      <div className="mb-6 text-gray-300">
                        <p className="mb-2">Application ID: HL-{Date.now().toString().slice(-6)}</p>
                        <p>We will review your application and get back to you within 1-2 business days.</p>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg mb-6 text-left">
                        <h4 className="font-semibold mb-2">Next Steps:</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li>• Loan application review</li>
                          <li>• Smart contract deployment</li>
                          <li>• Loan disbursement</li>
                        </ul>
                      </div>
                      <DialogClose asChild>
                        <Button 
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          onClick={() => {
                            window.location.href = '/applicant-dashboard';
                          }}
                        >
                          Return to Dashboard
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LoanApplicationFlow;