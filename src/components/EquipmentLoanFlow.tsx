// src/components/EquipmentLoanFlow.tsx
import React, { useState, useCallback } from 'react';
import { Camera, Upload, Shield, DollarSign, Calculator, FileCheck, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { APP_CONFIG } from '@/config/urls';

// Type definitions
type ViewType = 'frontView' | 'sideView';

interface EquipmentData {
  name: string;
  type: string;
  manufacturer: string;
  serialNumber: string;
  purchasePrice: string;
  condition: 'new' | 'refurbished' | 'used';
  frontView: string | null;
  sideView: string | null;
}

interface LoanTerms {
  amount: string;
  duration: string;
  interestRate: string;
  monthlyPayment: string;
}

const EquipmentLoanFlow: React.FC = () => {
  const [step, setStep] = useState(1);
  const [equipmentData, setEquipmentData] = useState<EquipmentData>({
    name: '',
    type: '',
    manufacturer: '',
    serialNumber: '',
    purchasePrice: '',
    condition: 'new',
    frontView: null,
    sideView: null
  });

  const [loanTerms, setLoanTerms] = useState<LoanTerms>({
    amount: '',
    duration: '12',
    interestRate: '6.99',
    monthlyPayment: ''
  });

  // Handle image upload
  const handleImageUpload = (view: ViewType, file: File | null) => {
    if (!file) {
      setEquipmentData(prev => ({
        ...prev,
        [view]: null
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (!result) return;
      
      setEquipmentData(prev => ({
        ...prev,
        [view]: result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEquipmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate loan payments
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

  const isStepOneValid = () => {
    return equipmentData.name !== '' && 
           equipmentData.type !== '' && 
           equipmentData.frontView !== null && 
           equipmentData.sideView !== null;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {['Equipment Details', 'Loan Terms', 'Final Review'].map((label, index) => (
          <div key={label} className="flex flex-col items-center w-1/3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
              ${step > index + 1 ? 'bg-green-500' : step === index + 1 ? 'bg-purple-600' : 'bg-gray-700'}`}>
              {step > index + 1 ? '✓' : index + 1}
            </div>
            <span className="text-sm text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Equipment Details */}
      {step === 1 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-purple-400" />
              Equipment Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Equipment Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full bg-gray-700 border-gray-600 rounded-lg p-2"
                  value={equipmentData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Equipment Type</label>
                <select 
                  name="type"
                  className="w-full bg-gray-700 border-gray-600 rounded-lg p-2"
                  value={equipmentData.type}
                  onChange={handleInputChange}
                >
                  <option value="">Select Type</option>
                  <option value="diagnostic">Diagnostic Equipment</option>
                  <option value="treatment">Treatment Equipment</option>
                  <option value="surgical">Surgical Equipment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Condition</label>
                <select 
                  name="condition"
                  className="w-full bg-gray-700 border-gray-600 rounded-lg p-2"
                  value={equipmentData.condition}
                  onChange={handleInputChange}
                >
                  <option value="new">New</option>
                  <option value="refurbished">Refurbished</option>
                  <option value="used">Used</option>
                </select>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Equipment Photos</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Front View Upload */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      handleImageUpload('frontView', file);
                    }}
                    className="hidden"
                    id="frontView"
                  />
                  <label 
                    htmlFor="frontView"
                    className="h-40 bg-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-600"
                  >
                    {equipmentData.frontView ? (
                      <img 
                        src={equipmentData.frontView} 
                        alt="Front View" 
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-400">Front View</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Side View Upload */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      handleImageUpload('sideView', file);
                    }}
                    className="hidden"
                    id="sideView"
                  />
                  <label 
                    htmlFor="sideView"
                    className="h-40 bg-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-600"
                  >
                    {equipmentData.sideView ? (
                      <img 
                        src={equipmentData.sideView} 
                        alt="Side View" 
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-400">Side View</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <Alert className="bg-purple-900/50 border border-purple-500">
              <AlertTriangle className="h-5 w-5 text-purple-400" />
              <AlertDescription>
                Equipment details will be verified with the manufacturer before loan approval.
                This process typically takes 1-2 business days.
              </AlertDescription>
            </Alert>

            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 mt-6"
              onClick={() => setStep(2)}
              disabled={!isStepOneValid()}
            >
              Continue to Loan Terms
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* NFT Creation Step */}
      {step === 2 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              NFT Creation Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300">Equipment Images</h3>
                <div className="grid grid-cols-2 gap-4">
                  {equipmentData.frontView && (
                    <img 
                      src={equipmentData.frontView} 
                      alt="Front View" 
                      className="h-32 w-full object-cover rounded-lg"
                    />
                  )}
                  {equipmentData.sideView && (
                    <img 
                      src={equipmentData.sideView} 
                      alt="Side View" 
                      className="h-32 w-full object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300">Equipment Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Name:</span> {equipmentData.name}</p>
                  <p><span className="text-gray-400">Type:</span> {equipmentData.type}</p>
                  <p><span className="text-gray-400">Condition:</span> {equipmentData.condition}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-300">NFT Metadata</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Token ID</p>
                  <p className="font-mono text-sm">HER-{Date.now().toString().slice(-6)}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Blockchain</p>
                  <p className="font-mono text-sm">Hedera Network</p>
                </div>
              </div>
            </div>

            <Alert className="bg-purple-900/50 border border-purple-500 mb-6">
              <AlertTriangle className="h-5 w-5 text-purple-400" />
              <AlertDescription>
                Creating an NFT will permanently record this equipment on the Hedera network.
                The NFT will serve as collateral for your loan.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(3)}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Continue to Loan Terms
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loan Terms Step */}
      {step === 3 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-purple-400" />
              Loan Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Loan Amount ($)</label>
                <input
                  type="number"
                  className="w-full bg-gray-700 border-gray-600 rounded-lg p-2"
                  value={loanTerms.amount}
                  onChange={(e) => {
                    const newTerms = {...loanTerms, amount: e.target.value};
                    setLoanTerms(newTerms);
                    // Calculate monthly payment whenever amount changes
                    const amount = parseFloat(e.target.value);
                    const rate = 6.99 / 100 / 12; // Monthly interest rate
                    const duration = parseInt(newTerms.duration);
                    if (amount && !isNaN(amount) && duration) {
                      const payment = (amount * rate * Math.pow(1 + rate, duration)) / (Math.pow(1 + rate, duration) - 1);
                      setLoanTerms(prev => ({...prev, monthlyPayment: payment.toFixed(2)}));
                    }
                  }}
                  placeholder="Enter loan amount"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Loan Duration (months)</label>
                <select
                  className="w-full bg-gray-700 border-gray-600 rounded-lg p-2"
                  value={loanTerms.duration}
                  onChange={(e) => {
                    const newDuration = e.target.value;
                    setLoanTerms(prev => ({...prev, duration: newDuration}));
                    // Recalculate monthly payment whenever duration changes
                    const amount = parseFloat(loanTerms.amount);
                    const rate = 6.99 / 100 / 12; // Monthly interest rate
                    const duration = parseInt(newDuration);
                    if (amount && !isNaN(amount) && duration) {
                      const payment = (amount * rate * Math.pow(1 + rate, duration)) / (Math.pow(1 + rate, duration) - 1);
                      setLoanTerms(prev => ({...prev, duration: newDuration, monthlyPayment: payment.toFixed(2)}));
                    }
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

            <div className="bg-gray-700 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Interest Rate</p>
                  <p className="text-2xl font-bold">6.99%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Monthly Payment</p>
                  <p className="text-2xl font-bold">
                    ${loanTerms.monthlyPayment || '0.00'}
                  </p>
                </div>
              </div>
            </div>

            <Alert className="bg-purple-900/50 border border-purple-500 mb-6">
              <AlertTriangle className="h-5 w-5 text-purple-400" />
              <AlertDescription>
                Your equipment NFT will be used as collateral for this loan.
                Terms are subject to final approval.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(4)}
                disabled={!loanTerms.amount || !loanTerms.duration}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Final Review
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Final Review Step */}
      {step === 4 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-purple-400" />
              Final Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Equipment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Equipment</p>
                    <p>{equipmentData.name}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">NFT ID</p>
                    <p className="font-mono">HER-{Date.now().toString().slice(-6)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Loan Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Loan Amount</p>
                    <p>${loanTerms.amount}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Duration</p>
                    <p>{loanTerms.duration} months</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Interest Rate</p>
                    <p>6.99% APR</p>
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
                  By submitting this application, you agree to use your equipment NFT as collateral
                  for this loan. The NFT will be locked in a smart contract until the loan is fully repaid.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setStep(3)}
                  className="text-gray-300 px-6 py-2 rounded-lg hover:text-white"
                >
                  Back to Terms
                </button>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                    >
                      Submit Application
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 border-gray-700 text-white">
                    <div className="text-center p-6">
                      <div className="w-12 h-12 rounded-full bg-green-500 mx-auto mb-4 flex items-center justify-center">
                        <FileCheck className="h-6 w-6 text-white" />
                      </div>
                      <DialogTitle className="text-xl font-semibold mb-4">
                        Application Submitted Successfully!
                      </DialogTitle>
                      <div className="mb-6 text-gray-300">
                        <p className="mb-2">Application ID: HL-{Date.now().toString().slice(-6)}</p>
                        <p>We will review your application and get back to you within 1-2 business days.</p>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg mb-6">
                        <h4 className="font-semibold mb-2">Next Steps</h4>
                        <ul className="text-left text-sm text-gray-300 space-y-2">
                          <li>• Equipment verification with manufacturer</li>
                          <li>• NFT creation and smart contract deployment</li>
                          <li>• Final loan approval and disbursement</li>
                        </ul>
                      </div>
                      <DialogClose asChild>
                        <button
                          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                          onClick={() => {
                            // Redirect to the correct dashboard URL
                            window.location.href = `${APP_CONFIG.baseUrl}/applicant-dashboard/`;
                          }}
                        >
                          Return to Dashboard
                        </button>
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

export default EquipmentLoanFlow;