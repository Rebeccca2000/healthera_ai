import React, { useState } from 'react';
import { Camera, Upload, Shield, DollarSign, FileCheck, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const EquipmentLoanFlow = () => {
  const [step, setStep] = useState(1);
  const [equipmentData, setEquipmentData] = useState({
    name: '',
    type: '',
    manufacturer: '',
    serialNumber: '',
    purchasePrice: '',
    condition: 'new',
    images: []
  });

  const [nftStatus, setNftStatus] = useState({
    tokenCreated: false,
    verificationComplete: false,
    collateralAssessed: false
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {['Equipment Details', 'NFT Creation', 'Loan Terms', 'Final Review'].map((label, index) => (
          <div key={label} className="flex flex-col items-center w-1/4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
              ${step > index + 1 ? 'bg-green-500' : step === index + 1 ? 'bg-purple-600' : 'bg-gray-700'}`}>
              {step > index + 1 ? '✓' : index + 1}
            </div>
            <span className="text-sm text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Equipment Details Step */}
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
                  className="w-full bg-gray-700 border-gray-600 rounded-lg p-2"
                  placeholder="e.g. Medical Scanner XR-500"
                  value={equipmentData.name}
                  onChange={(e) => setEquipmentData({...equipmentData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Equipment Type</label>
                <select 
                  className="w-full bg-gray-700 border-gray-600 rounded-lg p-2"
                  value={equipmentData.type}
                  onChange={(e) => setEquipmentData({...equipmentData, type: e.target.value})}
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
                  className="w-full bg-gray-700 border-gray-600 rounded-lg p-2"
                  value={equipmentData.condition}
                  onChange={(e) => setEquipmentData({...equipmentData, condition: e.target.value})}
                >
                  <option value="new">New</option>
                  <option value="refurbished">Refurbished</option>
                  <option value="used">Used</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-1">Equipment Photos</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-40 bg-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-600">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">Front View</span>
                </div>
                <div className="h-40 bg-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-600">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">Side View</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/50 border border-purple-500 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-purple-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-purple-400">Verification Required</h4>
                  <p className="text-sm text-gray-300">
                    Equipment details will be verified with the manufacturer before NFT creation.
                    This process typically takes 1-2 business days.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Continue to NFT Creation
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional steps would go here */}
    </div>
  );
};

export default EquipmentLoanFlow;