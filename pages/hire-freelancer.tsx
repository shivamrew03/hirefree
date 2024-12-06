import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Database } from '@tableland/sdk';
import { useAccount } from 'wagmi';

interface Milestone {
  name: string;
  amount: string;
}

interface Freelancer {
  id: number;
  wallet_address: string;
  full_name: string;
  email: string;
  skills: string[];
  experience: string;
  hourly_rate: number;
  portfolio: string;
  bio: string;
}

const HireFreelancer = () => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const { address } = useAccount();
  const [projectDetails, setProjectDetails] = useState({
    title: '',
    description: '',
    budget: '',
    timeline: '',
    milestones: [] as Milestone[]
  });

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await fetch('/api/freelancer/getAll');
        const data = await response.json();
        setFreelancers(data);
      } catch (error) {
        console.error('Error fetching freelancers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  const handleContactClick = (freelancer: Freelancer) => {
    setSelectedFreelancer(freelancer);
    setShowModal(true);
  };

  const addMilestone = () => {
    setProjectDetails({
      ...projectDetails,
      milestones: [...projectDetails.milestones, { name: '', amount: '' }]
    });
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
    const updatedMilestones = [...projectDetails.milestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      [field]: value
    };
    setProjectDetails({
      ...projectDetails,
      milestones: updatedMilestones
    });
  };

  const removeMilestone = (index: number) => {
    const updatedMilestones = projectDetails.milestones.filter((_, i) => i !== index);
    setProjectDetails({
      ...projectDetails,
      milestones: updatedMilestones
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!address || !selectedFreelancer) {
      alert('Please connect your wallet first');
      return;
    }

    // Add completed:false to each milestone
    const milestonesWithStatus = projectDetails.milestones.map(milestone => ({
      ...milestone,
      completed: false
    }));

    try {
      const response = await fetch('/api/project/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientAddress: address,
          freelancerAddress: selectedFreelancer.wallet_address,
          title: projectDetails.title,
          description: projectDetails.description,
          budget: projectDetails.budget,
          timeline: projectDetails.timeline,
          milestones: milestonesWithStatus
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Project request sent successfully!');
        setShowModal(false);
        setProjectDetails({
          title: '',
          description: '',
          budget: '',
          timeline: '',
          milestones: []
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('Failed to submit project request. Please try again.');
    }
  };
  return (
    <>
      <Head>
        <title>Hire Freelancers - HireFree</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center text-dark-blue">
            Available Freelancers
          </h1>

          {loading ? (
            <div className="text-center">Loading freelancers...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freelancers.map((freelancer) => (
                <div
                  key={freelancer.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <h2 className="text-xl font-semibold mb-2">{freelancer.full_name}</h2>
                  <p className="text-gray-600 mb-4">{freelancer.bio}</p>
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Skills:</h3>
                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">
                      <p>Experience: {freelancer.experience}</p>
                      <p>Rate: ${freelancer.hourly_rate}/hr</p>
                    </div>
                    <button 
                      onClick={() => handleContactClick(freelancer)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
            onClick={() => setShowModal(false)}
          />
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 ease-in-out translate-y-0 scale-100 opacity-100">
            <h2 className="text-2xl font-bold mb-4">Contact {selectedFreelancer?.full_name}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={projectDetails.title}
                  onChange={(e) => setProjectDetails({...projectDetails, title: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Project Description
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  value={projectDetails.description}
                  onChange={(e) => setProjectDetails({...projectDetails, description: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Budget (USD)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={projectDetails.budget}
                  onChange={(e) => setProjectDetails({...projectDetails, budget: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Timeline (in days)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={projectDetails.timeline}
                  onChange={(e) => setProjectDetails({...projectDetails, timeline: e.target.value})}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Milestones
                </label>
                <div className="space-y-4">
                  {projectDetails.milestones.map((milestone, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Milestone name"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={milestone.name}
                          onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="Amount (USD)"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={milestone.amount}
                          onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMilestone(index)}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="mt-4 bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600"
                >
                  + Add Milestone
                </button>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default HireFreelancer;
