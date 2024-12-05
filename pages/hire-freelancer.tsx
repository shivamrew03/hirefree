import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useAccount } from "wagmi";

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
  avatar?: string;
}

const HireFreelancer = () => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] =
    useState<Freelancer | null>(null);
  const { address } = useAccount();
  const [projectDetails, setProjectDetails] = useState({
    title: "",
    description: "",
    budget: "",
    timeline: "",
    milestones: [] as Milestone[],
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await fetch("/api/freelancer/getAll");
        const data = await response.json();
        setFreelancers(data);
      } catch (error) {
        console.error("Error fetching freelancers:", error);
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
      milestones: [...projectDetails.milestones, { name: "", amount: "" }],
    });
  };

  const updateMilestone = (
    index: number,
    field: keyof Milestone,
    value: string
  ) => {
    const updatedMilestones = [...projectDetails.milestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      [field]: value,
    };
    setProjectDetails({
      ...projectDetails,
      milestones: updatedMilestones,
    });
  };

  const removeMilestone = (index: number) => {
    const updatedMilestones = projectDetails.milestones.filter(
      (_, i) => i !== index
    );
    setProjectDetails({
      ...projectDetails,
      milestones: updatedMilestones,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !selectedFreelancer) {
      alert("Please connect your wallet first");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/project/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientAddress: address,
          freelancerAddress: selectedFreelancer.wallet_address,
          title: projectDetails.title,
          description: projectDetails.description,
          budget: projectDetails.budget,
          timeline: projectDetails.timeline,
          milestones: projectDetails.milestones,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTimeout(() => {
          setIsProcessing(false);
          setShowModal(false);
          setProjectDetails({
            title: "",
            description: "",
            budget: "",
            timeline: "",
            milestones: [],
          });
          alert("Request sent for project proposal!");
        }, 5000);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      setIsProcessing(false);
      alert("Failed to submit project request. Please try again.");
    }
  };

  return (
    <>
      <Head>
        <title>Hire Freelancers - HireFree</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Available Freelancers
          </h1>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {freelancers.map((freelancer) => (
                <div
                  key={freelancer.id}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${freelancer.wallet_address}`}
                      alt={freelancer.full_name}
                      className="w-16 h-16 rounded-full ring-2 ring-blue-500"
                    />
                    <div>
                      <h2 className="text-xl font-bold mb-1 text-gray-900">
                        {freelancer.full_name}
                      </h2>
                      <p className="text-gray-400 text-sm">
                        {freelancer.email}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-600 mb-2">
                      Skills:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-all duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-gray-400">
                      <p className="font-medium">
                        Experience: {freelancer.experience}
                      </p>
                      <p className="font-medium">
                        Rate: ${freelancer.hourly_rate}/hr
                      </p>
                    </div>
                    <button
                      onClick={() => handleContactClick(freelancer)}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
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
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowModal(false)}
          />
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 shadow-2xl mx-4">
            <h2 className="text-2xl font-bold mb-4">
              Contact {selectedFreelancer?.full_name}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={projectDetails.title}
                  onChange={(e) =>
                    setProjectDetails({
                      ...projectDetails,
                      title: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setProjectDetails({
                      ...projectDetails,
                      description: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setProjectDetails({
                      ...projectDetails,
                      budget: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setProjectDetails({
                      ...projectDetails,
                      timeline: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <h3 className="text-gray-700 font-bold">Milestones:</h3>
                {projectDetails.milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-4 mb-2">
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Milestone Name"
                      value={milestone.name}
                      onChange={(e) =>
                        updateMilestone(index, "name", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Amount (USD)"
                      value={milestone.amount}
                      onChange={(e) =>
                        updateMilestone(index, "amount", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => removeMilestone(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={addMilestone}
                >
                  Add Milestone
                </button>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Submit Request"}
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
