import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  DollarSign, 
  ArrowRight, 
  AlertTriangle,
  Check,
  RefreshCw
} from 'lucide-react';

const FiatDepositFlow = () => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [conversionRates, setConversionRates] = useState({
    audToUsd: 0.65,
    usdToUsdc: 1
  });

  const handleDeposit = async () => {
    setProcessingStatus('processing');
    // Simulate API call
    setTimeout(() => {
      setProcessingStatus('success');
      setTimeout(() => setStep(3), 1500);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {['Amount', 'Verification', 'Confirmation'].map((label, index) => (
          <div key={label} className="flex flex-col items-center w-1/3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
              ${step > index + 1 ? 'bg-green-500' : step === index + 1 ? 'bg-purple-600' : 'bg-gray-700'}`}>
              {step > index + 1 ? '✓' : index + 1}
            </div>
            <span className="text-sm text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Amount Input */}
      {step === 1 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-400" />
              Enter Deposit Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount (AUD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">$</span>
                  <input
                    type="number"
                    className="w-full bg-gray-700 border-gray-600 rounded-lg p-2 pl-8"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              {amount && (
                <div className="bg-gray-700 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">AUD to USD</span>
                    <div className="flex items-center gap-2">
                      <span>${(parseFloat(amount) * conversionRates.audToUsd).toFixed(2)}</span>
                      <Badge variant="outline" className="bg-purple-900/50 text-purple-400">
                        Rate: {conversionRates.audToUsd}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">USD to USDC</span>
                    <div className="flex items-center gap-2">
                      <span>{(parseFloat(amount) * conversionRates.audToUsd).toFixed(2)} USDC</span>
                      <Badge variant="outline" className="bg-purple-900/50 text-purple-400">
                        Rate: 1:1
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              <Alert className="bg-purple-900/50 border border-purple-500">
                <AlertTriangle className="h-5 w-5 text-purple-400" />
                <AlertDescription>
                  Funds will be converted to USDC for lending. Conversion rates are updated in real-time.
                </AlertDescription>
              </Alert>

              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={!amount || parseFloat(amount) <= 0}
                onClick={() => setStep(2)}
              >
                Continue to Verification
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Payment Details */}
      {step === 2 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-400" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm text-gray-400 mb-2">Transaction Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Amount (AUD)</span>
                    <span>${amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Converted to USDC</span>
                    <span>{(parseFloat(amount) * conversionRates.audToUsd).toFixed(2)} USDC</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Card Number</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border-gray-600 rounded-lg p-2"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border-gray-600 rounded-lg p-2"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">CVC</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border-gray-600 rounded-lg p-2"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleDeposit}
                disabled={processingStatus === 'processing'}
              >
                {processingStatus === 'processing' ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : processingStatus === 'success' ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Success!
                  </>
                ) : (
                  'Confirm Deposit'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center justify-center">
              <Check className="h-5 w-5 text-green-400" />
              Deposit Successful
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                <Check className="h-8 w-8 text-white" />
              </div>

              <div className="space-y-2">
                <p className="text-2xl font-bold">${amount} AUD</p>
                <p className="text-gray-400">Successfully deposited</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="font-mono">TXN-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">USDC Amount</span>
                  <span>{(parseFloat(amount) * conversionRates.audToUsd).toFixed(2)} USDC</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button 
                  className="flex-1 bg-gray-700 hover:bg-gray-600"
                  onClick={() => {
                    setAmount('');
                    setStep(1);
                    setProcessingStatus('idle');
                  }}
                >
                  Make Another Deposit
                </Button>
                <Button 
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    // Navigate to portfolio/dashboard
                    console.log('Navigate to portfolio');
                  }}
                >
                  View Portfolio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FiatDepositFlow;