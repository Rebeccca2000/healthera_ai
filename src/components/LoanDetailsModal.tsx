import React, { useState } from 'react';
import { X, Home, Package, Shield, DollarSign, AlertCircle  } from 'lucide-react';
import { LoanRequest } from './types';

const LoanDetailsModal = ({ isOpen, onClose, loanRequest }: LoanDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState('loan');
  
  if (!isOpen || !loanRequest) return null;

  const tabs = [
    { id: 'loan', label: 'Loan Info' },
    { id: 'personal', label: 'Personal Income' },
    { id: 'business', label: 'Business Income' },
    { id: 'accountant', label: 'Accountant' },
    { id: 'documents', label: 'Documents' }
  ];

  // Quick assessment data (you'll need to add these to your types)
  const quickAssessment = {
    equipment: {
      name: "Medical Scanner XR-500",
      type: "Diagnostic Equipment",
      condition: "New",
      supplier: "MedTech Solutions"
    },
    propertyStatus: {
      isHomeOwner: true,
      propertyValue: 850000,
      mortgage: 420000
    },
    creditHistory: {
      score: loanRequest.riskScore,
      level: loanRequest.riskLevel,
      defaultHistory: "None",
      creditorCount: 2
    },
    netAssetPosition: {
      totalAssets: 1250000,
      totalLiabilities: 480000,
      netPosition: 770000
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Loan Request Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        {/* Quick Assessment Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Equipment Details</h3>
              <Package className="h-5 w-5 text-purple-400" />
            </div>
            <p className="text-sm text-gray-300">{quickAssessment.equipment.name}</p>
            <p className="text-sm text-gray-300">{quickAssessment.equipment.type}</p>
            <p className="text-xs text-purple-400 mt-2">Verified Supplier</p>
          </div>

					<div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Property Status</h3>
              <Home className="h-5 w-5 text-purple-400" />
            </div>
            <p className="text-sm text-gray-300">Property Owner</p>
            <p className="text-sm text-gray-300">Value: ${quickAssessment.propertyStatus.propertyValue.toLocaleString()}</p>
            <p className="text-xs text-green-400 mt-2">Verified</p>
          </div>
					
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Credit Assessment</h3>
              <Shield className="h-5 w-5 text-purple-400" />
            </div>
            <p className="text-sm text-gray-300">Score: {quickAssessment.creditHistory.score}</p>
            <p className="text-sm text-gray-300">{quickAssessment.creditHistory.defaultHistory}</p>
            <p className="text-xs text-green-400 mt-2">Clean History</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Net Position</h3>
              <DollarSign className="h-5 w-5 text-purple-400" />
            </div>
            <p className="text-sm text-gray-300">Assets: ${quickAssessment.netAssetPosition.totalAssets.toLocaleString()}</p>
            <p className="text-sm text-gray-300">Net: ${quickAssessment.netAssetPosition.netPosition.toLocaleString()}</p>
            <p className="text-xs text-purple-400 mt-2">Strong Financial Position</p>
          </div>
        </div>

        {/* Risk Alert */}
        <div className="bg-purple-900/50 border border-purple-500 rounded-lg p-4 mb-6 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-purple-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-purple-400">AI Risk Assessment</h4>
            <p className="text-sm text-gray-300">This loan request has a low risk profile based on the applicant's property ownership, clean credit history, and strong net asset position. The equipment being financed is from a verified supplier in the medical industry.</p>
          </div>
        </div>

          

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6 border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`pb-2 px-4 ${
                activeTab === tab.id 
                  ? 'border-b-2 border-purple-500 text-white' 
                  : 'text-gray-400'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'loan' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Basic Loan Info</h3>
                <p><span className="text-gray-400">Loan Amount:</span> ${loanRequest.amount}</p>
                <p><span className="text-gray-400">Duration:</span> {loanRequest.duration} months</p>
                <p><span className="text-gray-400">Pre-Existing Loans:</span> $0</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Risk Assessment</h3>
                <p><span className="text-gray-400">Risk Score:</span> {loanRequest.riskScore}</p>
                <p><span className="text-gray-400">Risk Level:</span> {loanRequest.riskLevel}</p>
              </div>
            </div>
          )}

          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Monthly Income</h3>
                <p><span className="text-gray-400">Gross Salary:</span> ${loanRequest.personalIncome?.grossSalary || 'N/A'}</p>
                <p><span className="text-gray-400">After Tax:</span> ${loanRequest.personalIncome?.salaryAfterTax || 'N/A'}</p>
                <p><span className="text-gray-400">Contractor Income:</span> ${loanRequest.personalIncome?.contractorIncome || 'N/A'}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Annual Income</h3>
                <p><span className="text-gray-400">Other Investment Income:</span> ${loanRequest.personalIncome?.investmentIncome || 'N/A'}</p>
                <p><span className="text-gray-400">Other Income:</span> ${loanRequest.personalIncome?.otherIncome || 'N/A'}</p>
                <p><span className="text-gray-400">Last Tax Return:</span> ${loanRequest.personalIncome?.taxableIncome || 'N/A'}</p>
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Business Financials</h3>
                <p><span className="text-gray-400">Business Revenue:</span> ${loanRequest.businessIncome?.revenue || 'N/A'}</p>
                <p><span className="text-gray-400">ABN:</span> {loanRequest.businessIncome?.abn || 'N/A'}</p>
                <p><span className="text-gray-400">EBIT:</span> ${loanRequest.businessIncome?.ebit || 'N/A'}</p>
                <p><span className="text-gray-400">Addbacks:</span> ${loanRequest.businessIncome?.addbacks || 'N/A'}</p>
              </div>
            </div>
          )}

          {activeTab === 'accountant' && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Accountant Details</h3>
              <p><span className="text-gray-400">Name:</span> {loanRequest.accountant?.name || 'N/A'}</p>
              <p><span className="text-gray-400">Contact Number:</span> {loanRequest.accountant?.phone || 'N/A'}</p>
              <p><span className="text-gray-400">Email:</span> {loanRequest.accountant?.email || 'N/A'}</p>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Required Documents</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 bg-gray-600 rounded hover:bg-gray-500">
                    Download Client Profile Form
                  </button>
                  <button className="w-full text-left p-2 bg-gray-600 rounded hover:bg-gray-500">
                    Download Latest Financial Statement
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Document Status</h3>
                <p className={loanRequest.documents.id ? "text-green-400" : "text-red-400"}>
                  {loanRequest.documents.id ? "✓" : "✗"} ID Verification
                </p>
                <p className={loanRequest.documents.bank ? "text-green-400" : "text-red-400"}>
                  {loanRequest.documents.bank ? "✓" : "✗"} Bank Statements
                </p>
                <p className={loanRequest.documents.medical ? "text-green-400" : "text-red-400"}>
                  {loanRequest.documents.medical ? "✓" : "✗"} Medical Records
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-700">
          <button onClick={onClose} className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-500">
            Close
          </button>
          <button className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-500">
            Approve
          </button>
          <button className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailsModal;