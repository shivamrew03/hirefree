import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAccount, useConnect } from 'wagmi';

interface FormData {
  fullName: string;
  email: string;
  skills: string[];
  experience: string;
  hourlyRate: number;
  portfolio: string;
  bio: string;
}

type ErrorType = {
  type: 'REGISTRATION_FAILED' | 'ALREADY_REGISTERED' | 'WALLET_NOT_CONNECTED' | null;
  message: string;
};

const FreelancerRegistration = () => {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    skills: [],
    experience: '',
    hourlyRate: 0,
    portfolio: '',
    bio: '',
  });
  const [error, setError] = useState<ErrorType>({ type: null, message: '' });
  const [loading, setLoading] = useState<boolean>(false);

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData({ ...formData, skills });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError({ type: null, message: '' });

    if (!address) {
      setError({
        type: 'WALLET_NOT_CONNECTED',
        message: 'Please connect your wallet first'
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/freelancer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          walletAddress: address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === 'This wallet is already registered') {
          throw new Error('ALREADY_REGISTERED');
        }
        throw new Error('REGISTRATION_FAILED');
      }

      router.push('/dashboard/freelancer');
    } catch (err) {
      if (err instanceof Error) {
        switch (err.message) {
          case 'ALREADY_REGISTERED':
            setError({
              type: 'ALREADY_REGISTERED',
              message: 'This wallet is already registered. Cannot register more then once.'
            });
            break;
          default:
            setError({
              type: 'REGISTRATION_FAILED',
              message: 'Registration failed. Please try again later.'
            });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const ErrorMessage = ({ error }: { error: ErrorType }) => {
    if (!error.type) return null;

    const errorStyles = {
      ALREADY_REGISTERED: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      REGISTRATION_FAILED: 'bg-red-50 text-red-800 border-red-200',
      WALLET_NOT_CONNECTED: 'bg-orange-50 text-orange-800 border-orange-200'
    };

    const errorActions = {
      ALREADY_REGISTERED: (
        <div className="mt-2">
          <Link 
            href="/login" 
            className="text-yellow-800 underline hover:text-yellow-900"
          >
            Go to Login
          </Link>
        </div>
      ),
      REGISTRATION_FAILED: (
        <button 
          onClick={() => setError({ type: null, message: '' })}
          className="mt-2 text-red-800 underline hover:text-red-900"
        >
          Try Again
        </button>
      ),
      WALLET_NOT_CONNECTED: null
    };

    return (
      <div className={`p-4 rounded-lg border mb-6 ${errorStyles[error.type]}`}>
        <div className="flex items-center">
          <svg 
            className="w-5 h-5 mr-2" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <span className="font-medium">{error.message}</span>
        </div>
        {errorActions[error.type]}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Register as Freelancer - HireFree</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-4xl font-bold mb-8 text-center text-dark-blue">
            Register as a Freelancer
          </h1>

          <ErrorMessage error={error} />

          {!address ? (
            <div className="text-center mb-8 p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
              <p className="text-gray-600 mb-6">
                Please connect your wallet to continue with registration
              </p>
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Connect {connector.name}
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="skills">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  id="skills"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="React, TypeScript, Node.js"
                  onChange={handleSkillsChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="experience">
                  Years of Experience
                </label>
                <select
                  id="experience"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                >
                  <option value="">Select experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="hourlyRate">
                  Hourly Rate (USD)
                </label>
                <input
                  type="number"
                  id="hourlyRate"
                  required
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="portfolio">
                  Portfolio URL
                </label>
                <input
                  type="url"
                  id="portfolio"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default FreelancerRegistration; 