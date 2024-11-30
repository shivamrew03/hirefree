import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import Head from "next/head";

interface Project {
  id: number;
  client_address: string;
  freelancer_address: string;
  title: string;
  description: string;
  budget: number;
  timeline: number;
  milestones: object;
  status: string;
  timestamp: number;
}

export default function Projects() {
  const router = useRouter();
  const { address } = useAccount();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (address) {
        try {
          const response = await fetch(`/api/project/getByFreelancer?address=${address}`);
          const data = await response.json();
          console.log(data)
          setProjects(data);
        } catch (error) {
          console.error('Error fetching projects:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProjects();
  }, [address]);

  const handleProjectClick = (project: Project) => {
    router.push({
      pathname: `/${address}/${project.id}`,
      query: {
        projectId: project.id,
        title: project.title,
        description: project.description,
        budget: project.budget,
        timeline: project.timeline,
        milestones: JSON.stringify(project.milestones),
        status: project.status,
        client_address: project.client_address,
        freelancer_address: project.freelancer_address
      }
    });
  };
  
  

  return (
    <>
      <Head>
        <title>My Projects - HireFree</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center text-dark-blue">
            My Projects
          </h1>

          {loading ? (
            <div className="text-center">Loading projects...</div>
          ) : (
            <div className="grid gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Budget: ${project.budget}</p>
                      <p className="text-gray-600">Timeline: {project.timeline} days</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Client: {project.client_address}</p>
                      <p className="text-gray-600">Status: {project.status}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {projects.length === 0 && (
                <div className="text-center text-gray-600">
                  No projects found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
