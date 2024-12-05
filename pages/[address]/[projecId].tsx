import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import Head from "next/head";
import Link from "next/link";

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
      await fetch("/api/project/updateMilestone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project.id,
          milestoneIndex,
        }),
      });

      setCompletedMilestones((prev) => [...prev, milestoneIndex]);
      router.push("/create-invoice");
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  return (
    <>
      <Head>
        <title>{project?.title || "Project Details"} - HireFree</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold mb-6">{project.title}</h1>
            <div className="grid gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600">{project.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Project Details
                  </h2>
                  <p className="text-gray-600">Budget: ${project.budget}</p>
                  <p className="text-gray-600">
                    Timeline: {project.timeline} days
                  </p>
                  <p className="text-gray-600">Status: {project.status}</p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Client</h2>
                  <p className="text-gray-600">{project.client_address}</p>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Milestones</h2>
                <div className="space-y-4">
                  {parsedMilestones.map((milestone, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                        completedMilestones.includes(index)
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg flex items-center">
                            {completedMilestones.includes(index) && (
                              <span className="text-green-500 mr-2 text-xl">
                                ✓
                              </span>
                            )}
                            {milestone.name}
                          </h3>
                          <p className="text-gray-600 mt-2 text-lg font-medium">
                            Amount:{" "}
                            <span className="text-indigo-600">
                              ${milestone.amount}
                            </span>
                          </p>
                        </div>
                        {!completedMilestones.includes(index) && (
                          <button
                            onClick={() => handleCreateInvoice(index)}
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            Create Invoice
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
