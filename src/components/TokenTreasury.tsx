import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Coins } from 'lucide-react';

// Import the FiatDepositFlow component
const FiatDepositFlow = React.lazy(() => import('./FiatDepositFlow'));

const TokenTreasury = () => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  
  // Sample data for the token value history chart
  const chartData = [
    { date: '1 Jan', value: 1.0 },
    { date: '2 Jan', value: 1.0 },
    { date: '3 Jan', value: 1.0 },
    { date: '4 Jan', value: 1.0 },
    { date: '5 Jan', value: 1.0 },
  ];

  // Sample lending positions
  const lendingPositions = [
    {
      id: 3669,
      name: 'Dental Equipment Loan #3669',
      amount: 5000,
      apr: 6.99,
      status: 'Active'
    },
    {
      id: 3670,
      name: 'Medical Scanner Loan #3670',
      amount: 5000,
      apr: 7.25,
      status: 'Active'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Main Balance Card */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="flex items-center space-x-2">
              <Coins className="h-8 w-8 text-purple-400" />
              <h2 className="text-3xl font-bold">25,000 HLTA</h2>
            </div>
            <p className="text-gray-400">≈ $25,000 AUD</p>
            <Button 
              onClick={() => setIsDepositOpen(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Fiat Deposit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <h3 className="text-gray-400 mb-2">Available for Lending</h3>
            <p className="text-2xl font-bold">15,000 HLTA</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <h3 className="text-gray-400 mb-2">Currently Lent</h3>
            <p className="text-2xl font-bold">10,000 HLTA</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <h3 className="text-gray-400 mb-2">Total Earned Interest</h3>
            <p className="text-2xl font-bold">523 HLTA</p>
          </CardContent>
        </Card>
      </div>

      {/* Token Value History */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle>Token Value History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                />
                <YAxis 
                  stroke="#9CA3AF"
                  domain={[0, 1.2]}
                  ticks={[0, 0.3, 0.6, 0.9, 1.2]}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Active Lending Positions */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle>Active Lending Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lendingPositions.map((position) => (
              <div 
                key={position.id}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{position.name}</h4>
                  <p className="text-sm text-gray-400">
                    {position.amount} HLTA @ {position.apr}% APR
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  {position.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fiat Deposit Dialog */}
      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle>Fiat Deposit</DialogTitle>
          </DialogHeader>
          <React.Suspense fallback={<div>Loading...</div>}>
            <FiatDepositFlow />
          </React.Suspense>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TokenTreasury;