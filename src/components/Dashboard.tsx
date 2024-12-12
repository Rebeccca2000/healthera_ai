"use client";  // This must be the first line

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, FileText, CheckCircle, BarChart, Menu, LogOut, DollarSign, Users, Globe } from 'lucide-react';

// Rest of your Dashboard component code...
const Dashboard = () => {
  // Initialize state
  const [activeTab, setActiveTab] = useState('home');
  const [activeLoanStep, setActiveLoanStep] = useState('loan-info');

  // Sample metrics data
  const metrics = {
    hltaBalance: "0.00",
    lentFunds: "$0",
    recoveredFunds: "$0",
    globalUsers: "5"
  };

  // Sample approved loans data
  const approvedLoans = [
    {
      id: 1,
      amount: 3669,
      purpose: "Equipment Finance",
      duration: 24,
      dateRequested: "2021-12-14",
      status: "APPROVED"
    }
  ];

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status.toLowerCase()) {
        case 'approved':
          return 'bg-green-500';
        case 'pending':
          return 'bg-yellow-500';
        case 'rejected':
          return 'bg-red-500';
        default:
          return 'bg-gray-500';
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
        <div className="flex items-center mb-8">
          <img src="/api/placeholder/40/40" alt="Healthera.AI" className="mr-2" />
          <div>
            <h1 className="text-xl font-bold">Healthera.AI</h1>
            <p className="text-sm text-gray-400">Fast Digital Finance</p>
          </div>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
              activeTab === 'home' ? 'bg-purple-600' : 'hover:bg-gray-700'
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setActiveTab('loan-requests')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
              activeTab === 'loan-requests' ? 'bg-purple-600' : 'hover:bg-gray-700'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span>Loan Requests</span>
          </button>
          <button
            onClick={() => setActiveTab('approved-requests')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
              activeTab === 'approved-requests' ? 'bg-purple-600' : 'hover:bg-gray-700'
            }`}
          >
            <CheckCircle className="h-5 w-5" />
            <span>Approved Requests</span>
          </button>
          <button
            onClick={() => setActiveTab('deployed-assets')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
              activeTab === 'deployed-assets' ? 'bg-purple-600' : 'hover:bg-gray-700'
            }`}
          >
            <BarChart className="h-5 w-5" />
            <span>Deployed Assets/Funds</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            {activeTab === 'approved-requests' ? 'Approved Loan Requests' : 
             activeTab === 'home' ? 'Financier Home' : 
             activeTab === 'loan-requests' ? 'Loan Requests' : 
             'Deployed Assets/Funds'}
          </h2>
          <button className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>

        {activeTab === 'home' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">HLTA Balance</CardTitle>
                <DollarSign className="h-5 w-5 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.hltaBalance}</div>
                <span className="text-green-400">+0%</span>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Lent Funds</CardTitle>
                <DollarSign className="h-5 w-5 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.lentFunds}</div>
                <span className="text-red-400">-0%</span>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Recovered Funds</CardTitle>
                <DollarSign className="h-5 w-5 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.recoveredFunds}</div>
                <span className="text-green-400">+0%</span>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Global Users</CardTitle>
                <Globe className="h-5 w-5 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.globalUsers}</div>
                <span className="text-green-400">+3%</span>
              </CardContent>
            </Card>
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
                </tr>
              </thead>
              <tbody>
                {approvedLoans.map((loan) => (
                  <tr key={loan.id} className="border-t border-gray-700">
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <span>${loan.amount}</span>
                        <StatusBadge status={loan.status} />
                      </div>
                    </td>
                    <td>{loan.purpose}</td>
                    <td>{loan.duration}</td>
                    <td>{loan.dateRequested}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="mt-4 text-gray-400">
              Showing 1 to 1 of 1 entries
            </div>
          </div>
        )}

        {activeTab === 'loan-requests' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <select className="bg-gray-700 text-white rounded px-3 py-2">
                <option>10 entries per page</option>
                <option>25 entries per page</option>
                <option>50 entries per page</option>
              </select>
            </div>
            
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="pb-4">AMOUNT ($)</th>
                  <th className="pb-4">PURPOSE</th>
                  <th className="pb-4">DURATION</th>
                  <th className="pb-4">DATE REQUESTED</th>
                  <th className="pb-4">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-700">
                  <td className="py-4">$3,669</td>
                  <td>Equipment Finance</td>
                  <td>24</td>
                  <td>2021-12-14</td>
                  <td>
                    <button className="bg-purple-600 px-4 py-1 rounded">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;