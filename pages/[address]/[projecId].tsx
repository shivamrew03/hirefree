import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { useWalletClient } from "wagmi";
import { RequestNetwork, Types, Utils } from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import Head from "next/head";
import { ethers } from "ethers";
import { getRequestParameters } from '../../hooks/useInvoice';

interface Milestone {
  name: string;
  amount: string;
  completed: boolean;
}

interface Project {
  id: number;
  client_address: string;
  freelancer_address: string;
  title: string;
  description: string;
  budget: number;
  timeline: number;
  milestones: string;
  status: string;
  timestamp: number;
}

export default function ProjectDetails() {
  const router = useRouter();
  const { data: walletClient } = useWalletClient();
  const { query } = router;

  // Parse milestones and project details
  const parsedMilestones = query.milestones
    ? JSON.parse(String(query.milestones))
    : [];

  const project = {
    id: Number(query.projectId),
    title: String(query.title),
    description: String(query.description),
    budget: Number(query.budget),
    timeline: Number(query.timeline),
    milestones: String(query.milestones),
    status: String(query.status),
    client_address: String(query.client_address),
    freelancer_address: String(query.freelancer_address),
  };

  // State to track completed milestones
  const [completedMilestones, setCompletedMilestones] = useState<number[]>([]);

  // Handle invoice creation and update completed milestones
  const handleCreateInvoice = async (milestoneIndex: number) => {
    try {
      const web3SignatureProvider = new Web3SignatureProvider(walletClient);
      console.log("req started", walletClient)

      const requestClient = new RequestNetwork({
        nodeConnectionConfig: {
          baseURL: "https://sepolia.gateway.request.network/",
        },
        signatureProvider: web3SignatureProvider,
      });

      const milestone = parsedMilestones[milestoneIndex];

      const requestParameters = getRequestParameters(
        project.freelancer_address,
        project.client_address,
        milestone.amount,
        milestoneIndex,
        project.title,
        project.id.toString()
      );

      const request = await requestClient.createRequest(requestParameters);
      const confrm = await request.waitForConfirmation();

      const result = await fetch('/api/project/updateMilestone', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project.id,
          milestoneIndex,
          clientAddress: project.client_address,
          freelancerAddress: project.freelancer_address,
          milestoneName: parsedMilestones[milestoneIndex].name,
          milestoneAmount: parsedMilestones[milestoneIndex].amount
        }),
      });
  
      // Check if this was the last milestone
      if (milestoneIndex === parsedMilestones.length - 1) {
        // Update project status to completed
        await fetch('/api/project/updateStatus', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: project.id,
            status: 'COMPLETED'
          }),
        });
      }
  
      alert('Invoice created successfully!');
      router.push('/home');
      
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const CheckIcon = () => (
    <div className="h-10 w-10 rounded-full border-4 border-emerald-600 bg-emerald-50 flex items-center justify-center">
      <svg 
        className="h-7 w-7 text-emerald-500" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={5}  
          d="M5 13l4 4L19 7" 
        />
      </svg>
    </div>
  );
  


  return (
    <>
      <Head>
        <title>{project?.title || "Project Details"} - HireFree</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col items-center mb-6">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center mb-4">
                {project.title}
              </h1>
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700">
                {project.status}
              </span>
            </div>
            {/* Project Overview */}
            <div className="grid grid-cols-3 gap-8 mb-8">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:from-indigo-100 hover:to-purple-100 cursor-pointer">
                <p className="text-gray-600 text-sm mb-1">Budget</p>
                <p className="text-2xl font-bold text-indigo-600">
                  ${project.budget}
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:from-indigo-100 hover:to-purple-100 cursor-pointer">
                <p className="text-gray-600 text-sm mb-1">Timeline</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {project.timeline} days
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:from-indigo-100 hover:to-purple-100 cursor-pointer">
                <p className="text-gray-600 text-sm mb-1">Client</p>
                <p
                  className="text-sm font-medium text-indigo-600 truncate"
                  title={project.client_address}
                >
                  {project.client_address.slice(0, 6)}...
                  {project.client_address.slice(-4)}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Project Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          {/* Milestones Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Project Milestones
            </h2>
            <div className="space-y-4">
              {parsedMilestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${milestone.completed
                      ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200"
                      : "bg-white border-gray-200"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">
                        {milestone.name}
                      </h3>
                      <p className="text-gray-600 mt-2">
                        Amount:{" "}
                        <span className="text-lg font-semibold text-indigo-600">
                          ${milestone.amount}
                        </span>
                      </p>
                    </div>
                    {milestone.completed ? (
                      <CheckIcon />
                    ) : (
                      index === parsedMilestones.findIndex(m => !m.completed) && (
                        <button
                          onClick={() => handleCreateInvoice(index)}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                        >
                          Create Invoice
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
