// src/components/NFTDetailsCard.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, Play, FileText, Activity, DollarSign, Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NFTDetailsCardProps {
  nft: {
    name: string;
    tokenId?: string;
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
  };
  viewMode?: 'applicant' | 'lender';
}

const NFTDetailsCard = ({ nft, viewMode = 'applicant' }: NFTDetailsCardProps) => {
  const [activeTab, setActiveTab] = useState('info');
  const [isMiniting, setIsMinting] = useState(false);

  const handleMintNFT = async () => {
    setIsMinting(true);
    setTimeout(() => {
      setIsMinting(false);
    }, 2000);
  };

  const renderCollateralContent = () => {
    if (viewMode === 'lender') {
      return (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm text-gray-400 mb-1">Asset Value</h3>
              <p className="text-2xl font-bold">${nft.currentValue}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm text-gray-400 mb-1">Asset Status</h3>
              <p className="text-2xl font-bold">{nft.status}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm text-gray-400 mb-1">Equipment Score</h3>
              <p className="text-2xl font-bold">{nft.riskScore}/100</p>
            </div>
          </div>
          <Alert className="bg-purple-900/50 border border-purple-500">
            <AlertTriangle className="h-5 w-5 text-purple-400" />
            <AlertDescription>
              This NFT will serve as collateral for the loan request. The equipment score indicates 
              the asset's quality and maintenance history. Higher scores suggest lower risk.
            </AlertDescription>
          </Alert>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm text-gray-400 mb-1">Valuation Details</h3>
            <p className="text-sm">Last appraisal: {nft.lastVerified}</p>
            <p className="text-sm">Verified by: {nft.verifier}</p>
          </div>
        </>
      );
    }

    // Applicant view
    return (
      <>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm text-gray-400 mb-1">Asset Value</h3>
            <p className="text-2xl font-bold">${nft.currentValue}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm text-gray-400 mb-1">Asset Status</h3>
            <p className="text-2xl font-bold">{nft.status}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm text-gray-400 mb-1">Equipment Score</h3>
            <p className="text-2xl font-bold">{nft.riskScore}/100</p>
          </div>
        </div>

        {nft.status === 'Available' ? (
          <>
            <Alert className="bg-purple-900/50 border border-purple-500">
              <AlertTriangle className="h-5 w-5 text-purple-400" />
              <AlertDescription>
                This NFT is available to be used as collateral for a loan application.
                Higher equipment scores may qualify for better loan terms.
              </AlertDescription>
            </Alert>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Start Loan Application
            </Button>
          </>
        ) : (
          <Alert className="bg-purple-900/50 border border-purple-500">
            <AlertTriangle className="h-5 w-5 text-purple-400" />
            <AlertDescription>
              This NFT is currently being used as collateral for an active loan.
              It will become available once the loan is fully repaid.
            </AlertDescription>
          </Alert>
        )}
      </>
    );
  };

  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl text-white">{nft.name}</CardTitle>
          <p className="text-sm text-gray-400">
            {nft.tokenId ? `Token ID: ${nft.tokenId}` : 'Not Minted'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!nft.tokenId && viewMode === 'applicant' && (
            <Button 
              variant="outline" 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleMintNFT}
              disabled={isMiniting}
            >
              {isMiniting ? 'Minting...' : 'Mint NFT'}
            </Button>
          )}
          <Badge 
            variant="outline" 
            className={nft.status === 'Collateralized' ? 
              'bg-purple-900/50 text-purple-400 border-purple-500' : 
              'bg-green-900/50 text-green-400 border-green-500'}
          >
            {nft.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4">
          <img 
            src={nft.image} 
            alt={nft.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              View NFT Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                NFT Details - {nft.name}
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-700">
                <TabsTrigger value="info" onClick={() => setActiveTab('info')}>
                  <Info className="w-4 h-4 mr-2" />
                  Information
                </TabsTrigger>
                <TabsTrigger value="media" onClick={() => setActiveTab('media')}>
                  <Play className="w-4 h-4 mr-2" />
                  Media
                </TabsTrigger>
                <TabsTrigger value="history" onClick={() => setActiveTab('history')}>
                  <Activity className="w-4 h-4 mr-2" />
                  History
                </TabsTrigger>
                <TabsTrigger value="collateral" onClick={() => setActiveTab('collateral')}>
                  <DollarSign className="w-4 h-4 mr-2" />
                  {viewMode === 'lender' ? 'Collateral Details' : 'Use as Collateral'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="p-4">
                {/* Info content remains the same */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-sm text-gray-400 mb-1">Equipment Details</h3>
                      <p className="font-medium">Manufacturer: {nft.manufacturer}</p>
                      <p className="font-medium">Serial Number: {nft.serialNumber}</p>
                      <p className="font-medium">Purchase Date: {nft.purchaseDate}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-sm text-gray-400 mb-1">Verification Status</h3>
                      <div className="flex items-center space-x-2">
                        <Shield className="text-green-400 w-4 h-4" />
                        <span className="text-green-400">Verified by {nft.verifier}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-sm text-gray-400 mb-1">NFT Status</h3>
                      <p className="font-medium">Status: {nft.status}</p>
                      <p className="font-medium">Created: {nft.purchaseDate}</p>
                      {nft.tokenId && (
                        <p className="font-medium">Token ID: {nft.tokenId}</p>
                      )}
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-sm text-gray-400 mb-1">Current Value</h3>
                      <p className="text-2xl font-bold">${nft.currentValue}</p>
                      <p className="text-sm text-gray-400">Last verified: {nft.lastVerified}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="p-4">
                {/* Media content remains the same */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-300">Equipment Photos</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {nft.photos.map((photo, index) => (
                        <img 
                          key={index}
                          src={photo}
                          alt={`Equipment view ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-300">Documentation</h3>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <FileText className="w-4 h-4 text-purple-400" />
                        <span>Warranty Certificate</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-purple-400" />
                        <span>Service History</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="p-4">
                {/* History content remains the same */}
                <div className="space-y-4">
                  {nft.history.map((event, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium">{event.action}</p>
                        <p className="text-sm text-gray-400">{event.date}</p>
                      </div>
                      <Badge variant="outline" className="bg-gray-600">
                        {event.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="collateral" className="p-4">
                <div className="space-y-6">
                  {renderCollateralContent()}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-400">Estimated Value</p>
            <p className="text-lg font-bold">${nft.currentValue}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Last Verified</p>
            <p className="text-lg font-bold">{nft.lastVerified}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTDetailsCard;