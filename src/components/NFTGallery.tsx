// src/components/NFTGallery.tsx
import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import NFTDetailsCard from '@/components/NFTDetailsCard';
import { useRouter } from 'next/navigation';
import { APP_CONFIG } from '@/config/urls';
// Sample NFT data
const sampleNFTs = [
  {
    name: "Dental X-Ray Machine",
    tokenId: "HER-123456",
    status: "Collateralized",
    manufacturer: "DentalTech Pro",
    serialNumber: "DT-2024-789",
    purchaseDate: "2024-01-15",
    verifier: "MedEquip Certification",
    currentValue: "25,000",
    lastVerified: "2024-01-15",
    image: `${APP_CONFIG.apiUrl}/placeholder/400/300`,
    photos: [
      `${APP_CONFIG.apiUrl}/placeholder/200/200`,
      `${APP_CONFIG.apiUrl}/placeholder/200/200`
    ],
    riskScore: "85",
    history: [
      { action: "NFT Created", date: "2024-01-15", type: "Creation" },
      { action: "Value Verified", date: "2024-01-15", type: "Verification" },
      { action: "Loan Collateralized", date: "2024-01-20", type: "Loan" }
    ]
  },
  {
    name: "Sterilization Unit",
    tokenId: "HER-789012",
    status: "Available",
    manufacturer: "MedEquip",
    serialNumber: "ME-2023-456",
    purchaseDate: "2023-12-01",
    verifier: "MedEquip Certification",
    currentValue: "15,000",
    lastVerified: "2024-01-20",
    image: `${APP_CONFIG.apiUrl}/placeholder/400/300`,
    photos: [
      `${APP_CONFIG.apiUrl}/placeholder/200/200`,
      `${APP_CONFIG.apiUrl}/placeholder/200/200`
    ],
    riskScore: "90",
    history: [
      { action: "NFT Created", date: "2024-01-20", type: "Creation" },
      { action: "Value Verified", date: "2024-01-20", type: "Verification" }
    ]
  }
];

const NFTGallery = () => {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Add Equipment Button */}
      <div className="flex justify-end">
        <Button 
          onClick={() => router.push(`${APP_CONFIG.baseUrl}/applicant-dashboard/mint-nft`)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sampleNFTs.map((nft, index) => (
        <NFTDetailsCard key={index} nft={nft} viewMode="applicant" />
      ))}
      </div>

      {/* Empty State */}
      {sampleNFTs.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center py-12">
            <CardTitle className="text-gray-400">No NFTs Found</CardTitle>
            <p className="text-sm text-gray-500">
              Add your first piece of equipment to get started.
            </p>
            <Button 
              className="mt-4 bg-purple-600 hover:bg-purple-700"
              onClick={() => router.push(`${APP_CONFIG.baseUrl}/applicant-dashboard/mint-nft`)}
            >
              Add Equipment
            </Button>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default NFTGallery;