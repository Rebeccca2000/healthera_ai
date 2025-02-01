'use client';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Shield, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { mintNFT } from '@/services/apiClient';

interface EquipmentData {
  name: string;
  type: string;
  manufacturer: string;
  serialNumber: string;
  condition: 'new' | 'refurbished' | 'used';
  frontView: string | null;
  sideView: string | null;
}

type MintingStatus = 'idle' | 'processing' | 'success' | 'error';

const NFTMintingFlow: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [equipmentData, setEquipmentData] = useState<EquipmentData>({
    name: '',
    type: '',
    manufacturer: '',
    serialNumber: '',
    condition: 'new',
    frontView: null,
    sideView: null
  });

  const [mintingStatus, setMintingStatus] = useState<MintingStatus>('idle');

  const handleImageUpload = (view: 'frontView' | 'sideView', file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setEquipmentData(prev => ({
          ...prev,
          [view]: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEquipmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMintNFT = async () => {
    try {
      setMintingStatus('processing');
      
      await mintNFT({
        userId: user?.id,
        equipmentName: equipmentData.name,
        equipmentType: equipmentData.type,
        description: `${equipmentData.type} - ${equipmentData.condition}`,
        images: {
          frontView: equipmentData.frontView,
          sideView: equipmentData.sideView
        }
      });
  
      setMintingStatus('success');
      setStep(3);
    } catch (error) {
      console.error('Error minting NFT:', error);
      setMintingStatus('error');
    }
  };

  const resetForm = () => {
    setStep(1);
    setEquipmentData({
      name: '',
      type: '',
      manufacturer: '',
      serialNumber: '',
      condition: 'new',
      frontView: null,
      sideView: null
    });
    setMintingStatus('idle');
  };

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
        {['Equipment Details', 'NFT Preview', 'Confirmation'].map((label, index) => (
          <div key={label} className="flex flex-col items-center w-1/3">
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
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Equipment Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full bg-gray-700 border-gray-600 rounded-lg p-2"
                    placeholder="e.g. Medical Scanner XR-500"
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


              <div>
                <label className="block text-sm text-gray-400 mb-2">Equipment Photos</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('frontView', e.target.files?.[0] || null)}
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
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('sideView', e.target.files?.[0] || null)}
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
                  Equipment details will be verified with the manufacturer before NFT creation.
                  This process typically takes 1-2 business days.
                </AlertDescription>
              </Alert>

              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => setStep(2)}
                disabled={!isStepOneValid()}
              >
                Continue to NFT Preview
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* NFT Preview Step */}
      {step === 2 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              NFT Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm text-gray-400 mb-2">Equipment Images</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {equipmentData.frontView && (
                      <img 
                        src={equipmentData.frontView} 
                        alt="Front View" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                    {equipmentData.sideView && (
                      <img 
                        src={equipmentData.sideView} 
                        alt="Side View" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-2">Equipment Details</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-400">Name:</span> {equipmentData.name}</p>
                    <p><span className="text-gray-400">Type:</span> {equipmentData.type}</p>
                    <p><span className="text-gray-400">Condition:</span> {equipmentData.condition}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Token ID</p>
                  <p className="font-mono">HER-{Date.now().toString().slice(-6)}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Blockchain</p>
                  <p className="font-mono">Hedera Network</p>
                </div>
              </div>

              <Alert className="bg-purple-900/50 border border-purple-500">
                <AlertTriangle className="h-5 w-5 text-purple-400" />
                <AlertDescription>
                  Creating an NFT will permanently record this equipment on the Hedera network.
                  Once verified, you can use this NFT as collateral for loans.
                </AlertDescription>
              </Alert>

              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleMintNFT}
                disabled={mintingStatus === 'processing'}
              >
                {mintingStatus === 'processing' ? (
                  <div className="flex items-center">
                    <span className="animate-spin mr-2">◌</span>
                    Minting NFT...
                  </div>
                ) : 'Mint this NFT'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Step */}
      {step === 3 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-2">NFT Creation Request Submitted!</h2>
                <p className="text-gray-400">Your equipment verification and NFT minting request has been received.</p>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg text-left space-y-4">
                <h3 className="font-semibold">Next Steps:</h3>
                <ol className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                    Equipment details verification (1-2 business days)
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                    NFT minting on Hedera network
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                    NFT available in your gallery
                  </li>
                </ol>
              </div>

              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-gray-700 hover:bg-gray-600"
                  onClick={() => {
                    setStep(1);
                    setEquipmentData({
                      name: '',
                      type: '',
                      manufacturer: '',
                      serialNumber: '',
                      condition: 'new',
                      frontView: null,
                      sideView: null
                    });
                    setMintingStatus('idle');
                  }}
                >
                  Mint Another NFT
                </Button>
                <Button 
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    // Navigate to NFT gallery
                    window.location.href = '/applicant-dashboard/nfts';
                  }}
                >
                  View My NFTs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NFTMintingFlow;