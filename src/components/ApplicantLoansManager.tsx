import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const ApplicantLoansManager = () => {
  const [activeLoans] = useState([
    {
      id: 'LOAN-001',
      nftId: 'NFT-001',
      amount: 20000,
      term: 36,
      startDate: '2024-01-15',
      interestRate: 6.99,
      monthlyPayment: 618,
      remainingBalance: 19382,
      nextPaymentDate: '2024-02-15',
      status: 'Active',
      paymentHistory: [
        { month: 'Jan', payment: 618, balance: 20000 },
        { month: 'Feb', payment: 618, balance: 19382 },
        { month: 'Mar', payment: 0, balance: 19382 }
      ]
    }
  ]);

  return (
    <div className="space-y-6">
      {activeLoans.map((loan) => (
        <div key={loan.id} className="bg-gray-800 rounded-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Equipment Loan {loan.id}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Collateral: NFT-{loan.nftId}
              </p>
            </div>
            <Badge className="bg-green-600">{loan.status}</Badge>
          </div>

          {/* Loan Details Grid */}
          <div className="grid grid-cols-4 gap-x-6 mb-8">
            <div>
              <p className="text-sm text-gray-400">Loan Amount</p>
              <p className="text-2xl font-semibold mt-1">${loan.amount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Monthly Payment</p>
              <p className="text-2xl font-semibold mt-1">${loan.monthlyPayment}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Interest Rate</p>
              <p className="text-2xl font-semibold mt-1">{loan.interestRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Term</p>
              <p className="text-2xl font-semibold mt-1">{loan.term} months</p>
            </div>
          </div>

          {/* Payment History Graph */}
          <div className="bg-gray-900/50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Payment History</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={loan.paymentHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9CA3AF"
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Next Payment Section */}
          <div className="bg-purple-900/50 rounded-lg p-4 flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-300">Next Payment Due</p>
              <p className="text-xl font-semibold text-white">
                ${loan.monthlyPayment} on {loan.nextPaymentDate}
              </p>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
              Make Payment
            </button>
          </div>

          {/* Footer Links */}
          <div className="flex justify-between text-sm text-purple-400">
            <button className="hover:text-purple-300">View Loan Agreement</button>
            <button className="hover:text-purple-300">View on Hedera</button>
          </div>
        </div>
      ))}

      {/* Empty State */}
      {activeLoans.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-2">No Active Loans</p>
          <p className="text-sm text-gray-500">
            Visit the My NFTs section to apply for a loan using your equipment as collateral.
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicantLoansManager;