// src/components/LandingPage.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Mail, AlertCircle } from 'lucide-react';


const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};


const LandingPage = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('lender');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <nav className="fixed w-full py-6 px-6 flex justify-between items-center z-50 bg-gray-900/95 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <span className="text-purple-500 text-2xl">+</span>
          <h1 className="text-2xl font-bold">
            <span className="text-white">Healthera</span>
            <span className="text-purple-500">.AI</span>
          </h1>
        </div>

        <div className="flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('features')} 
            className="text-gray-300 hover:text-white"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('about')} 
            className="text-gray-300 hover:text-white"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('contact')} 
            className="text-gray-300 hover:text-white"
          >
            Contact
          </button>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-6xl font-bold mb-6">
          <span className="text-gray-300">Healthcare Finance, </span>
          <span className="text-purple-500">Reimagined</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-3xl mb-12">
          Revolutionizing medical equipment financing with blockchain technology. Secure,
          transparent, and efficient funding solutions for healthcare providers.
        </p>
        <button
          onClick={() => setIsLoginOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg"
        >
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Risk Assessment */}
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-purple-500 w-12 h-12 mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-300 mb-4">Advanced Risk Assessment</h3>
              <p className="text-gray-400">
                Intelligent algorithms analyze multiple data points for accurate risk profiling.
              </p>
            </div>

            {/* Feature 2: Fast Processing */}
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-purple-500 w-12 h-12 mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-300 mb-4">Fast Processing</h3>
              <p className="text-gray-400">
                Quick approval process with automated verification systems.
              </p>
            </div>

            {/* Feature 3: Analytics */}
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-purple-500 w-12 h-12 mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-300 mb-4">Real-time Analytics</h3>
              <p className="text-gray-400">
                Comprehensive dashboard with performance metrics and insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">Login to Healthera.AI</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} defaultValue="lender" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700">
              <TabsTrigger 
                value="lender"
                onClick={() => setActiveTab('lender')}
                className="data-[state=active]:bg-purple-600"
              >
                Lender Login
              </TabsTrigger>
              <TabsTrigger 
                value="applicant"
                onClick={() => setActiveTab('applicant')}
                className="data-[state=active]:bg-purple-600"
              >
                Applicant Login
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder={`${activeTab}@healthera.ai`}
                    className="pl-10 bg-gray-700 border-gray-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="pl-10 bg-gray-700 border-gray-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Login as {activeTab === 'lender' ? 'Lender' : 'Applicant'}
              </Button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400">Demo Credentials:</p>
                <div className="mt-2 text-xs text-gray-500">
                  Email: {activeTab}@healthera.ai<br />
                  Password: {activeTab}0101
                </div>
              </div>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-6xl font-bold mb-6">
          <span className="text-gray-300">Healthcare Finance, </span>
          <span className="text-purple-500">Reimagined</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-3xl mb-12">
          Revolutionizing medical equipment financing with blockchain technology. Secure,
          transparent, and efficient funding solutions for healthcare providers.
        </p>
        <button
          onClick={() => setIsLoginOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg"
        >
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="text-gray-300">Why Choose </span>
            <span className="text-purple-500">Healthera.AI</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Secure NFT Collateral",
                description: "Transform your medical equipment into digital assets with our NFT technology."
              },
              {
                title: "Fast Approval Process",
                description: "Get your loan approved quickly with our streamlined application process."
              },
              {
                title: "Competitive Rates",
                description: "Benefit from our competitive interest rates and flexible repayment terms."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;