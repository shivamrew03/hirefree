import React from "react";
import Link from "next/link";
import Head from "next/head";

const Home = () => {
  return (
    <>
      <Head>
        <title>HireFree</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="animate-fade-in-down">
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                Welcome to HireFree
              </h1>
              <p className="text-2xl text-dark-grey mb-12 max-w-3xl mx-auto leading-relaxed">
                A decentralized platform connecting freelancers and clients
                through secure blockchain payments
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-8 rounded-xl shadow-small border-2 border-blue-500/10 hover:border-blue-500">
                  <div className="text-4xl mb-4">🔒</div>
                  <h3 className="text-xl font-semibold text-dark-blue mb-2">
                    Secure Payments
                  </h3>
                  <p className="text-dark-grey">
                    Blockchain-based transactions with escrow
                  </p>
                </div>
              </div>

              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-8 rounded-xl shadow-small border-2 border-blue-500/10 hover:border-blue-500">
                  <div className="text-4xl mb-4">💼</div>
                  <h3 className="text-x1 font-semibold text-dark-blue mb-2">
                    Milestone Tracking
                  </h3>
                  <p className="text-dark-grey">
                    Organized project management system
                  </p>
                </div>
              </div>

              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-8 rounded-xl shadow-small border-2 border-blue-500/10 hover:border-blue-500">
                  <div className="text-4xl mb-4">🌐</div>
                  <h3 className="text-xl font-semibold text-dark-blue mb-2">
                    Multi-Chain
                  </h3>
                  <p className="text-dark-grey">
                    Support for multiple blockchain networks
                  </p>
                </div>
              </div>

              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-8 rounded-xl shadow-small border-2 border-blue-500/10 hover:border-blue-500">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-x0.98 font-semibold text-dark-blue mb-2">
                    Direct Collaboration
                  </h3>
                  <p className="text-dark-grey">
                    Seamless client-freelancer connection
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <Link
                  href="/hire"
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity shadow-small hover:shadow-md transform hover:-translate-y-1 transition-transform duration-300"
                >
                  Hire a Freelancer
                </Link>
                <Link
                  href="/register/freelancer"
                  className="px-8 py-4 bg-dark-blue text-white rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-opacity shadow-small hover:shadow-md transform hover:-translate-y-1 transition-transform duration-300"
                >
                  Register as Freelancer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
