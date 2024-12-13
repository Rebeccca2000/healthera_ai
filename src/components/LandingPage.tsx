import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { 
  ArrowRight,  
  Shield, 
  Clock, 
  BarChart,
  X 
} from 'lucide-react';

interface LandingPageProps {
  // If truly no props needed, you can remove the interface entirely
}

const LandingPage: React.FC<LandingPageProps> = () => {
  const [activeTab, setActiveTab] = useState('lender');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      setShowLoginModal(false);
      // If you're using router for navigation after login
      router.push('/dashboard');
    } catch (error) {
      // Add an alert for now - you might want to show this in the UI more elegantly
      alert('Invalid credentials!');
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="fixed w-full bg-gray-900/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/healthera_ai" className="flex items-center">
                <div className="w-6 h-6">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z"
                      fill="#8B5CF6"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <span className="text-xl font-bold text-white">Healthera</span>
                  <span className="text-xl font-bold text-purple-500">.AI</span>
                </div>
              </Link>
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-purple-600 px-4 py-2 rounded-lg text-white hover:bg-purple-700 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Healthcare Finance, <span className="text-purple-500">Reimagined</span>
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Empowering healthcare providers with fast, intelligent financing solutions powered by AI
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/healthera_ai/dashboard">
            <button className="bg-purple-600 px-6 py-3 rounded-lg text-white hover:bg-purple-700 transition-colors flex items-center">
              Get Started <ArrowRight className="ml-2" />
            </button>
          </Link>
          <Link href="/healthera_ai/about">
            <button className="border border-purple-600 px-6 py-3 rounded-lg text-purple-500 hover:bg-purple-600/10 transition-colors">
              Learn More
            </button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('lender')}
                  className={`px-6 py-3 rounded-lg transition-colors ${
                    activeTab === 'lender' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  For Lenders
                </button>
                <button
                  onClick={() => setActiveTab('applicant')}
                  className={`px-6 py-3 rounded-lg transition-colors ${
                    activeTab === 'applicant' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  For Applicants
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'lender' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-700 p-6 rounded-xl">
                <Shield className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Advanced Risk Assessment
                </h3>
                <p className="text-gray-300">
                  AI-powered risk analysis for smarter lending decisions
                </p>
              </div>

              <div className="bg-gray-700 p-6 rounded-xl">
                <Clock className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Fast Processing
                </h3>
                <p className="text-gray-300">
                  Automated workflows for quick application processing
                </p>
              </div>

              <div className="bg-gray-700 p-6 rounded-xl">
                <BarChart className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Real-time Analytics
                </h3>
                <p className="text-gray-300">
                  Comprehensive dashboard with performance metrics
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition-colors"
              >
                Sign In
              </button>
            </form>
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;