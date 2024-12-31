// src/components/ApplicantDashboard.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, FileText, Package, DollarSign, Clock, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import EquipmentLoanFlow from '@/components/EquipmentLoanFlow';

const ApplicantDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sample metrics for the applicant dashboard
  const metrics = {
    activeLoans: "1",
    totalBorrowed: "$3,669",
    nextPayment: "$180",
    paymentDate: "Feb 15, 2024",
    equipmentValue: "$4,500",
    creditScore: "85"
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gray-800 min-h-screen p-4">
        <div className="flex items-center mb-8">
          <div className="w-6 h-6">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z"
                fill="#8B5CF6"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">
              <span className="text-white">Healthera</span>
              <span className="text-purple-500">.AI</span>
            </h1>
            <p className="text-sm text-gray-400">Applicant Portal</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'my-loans', icon: FileText, label: 'My Loans' },
            { id: 'new-application', icon: Package, label: 'New Application' },
            { id: 'payments', icon: DollarSign, label: 'Payments' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
                activeTab === id ? 'bg-purple-600' : 'hover:bg-gray-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            {activeTab === 'home' ? 'Welcome Back' :
             activeTab === 'my-loans' ? 'My Loans' :
             activeTab === 'new-application' ? 'New Loan Application' :
             'Payments'}
          </h2>

          {/* Profile Menu */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-3 bg-gray-800 p-2 rounded-lg hover:bg-gray-700"
            >
              <Image 
                src="/healthera_ai/api/placeholder/40/40"
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-gray-200">Dr. Smith</span>
            </button>

            {isProfileMenuOpen && (
              <div ref={profileMenuRef} className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-700">Profile</button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-700">Settings</button>
                <button 
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {activeTab === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Active Loans', value: metrics.activeLoans, icon: FileText },
              { title: 'Total Borrowed', value: metrics.totalBorrowed, icon: DollarSign },
              { title: 'Next Payment', value: metrics.nextPayment, icon: Clock },
              { title: 'Payment Due', value: metrics.paymentDate, icon: Globe },
              { title: 'Equipment Value', value: metrics.equipmentValue, icon: Package },
              { title: 'Credit Score', value: metrics.creditScore, icon: DollarSign }
            ].map((metric, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <metric.icon className="h-5 w-5 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'new-application' && (
          <EquipmentLoanFlow />
        )}

        {/* Additional tab content would go here */}
      </div>
    </div>
  );
};

export default ApplicantDashboard;