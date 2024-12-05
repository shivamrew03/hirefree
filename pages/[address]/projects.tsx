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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Projects
          </h1>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : (
            <div className="grid gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 cursor-pointer border border-gray-100 transform hover:-translate-y-1"
                >
                  <h2 className="text-2xl font-bold mb-3 text-gray-800">{project.title}</h2>
                  <p className="text-gray-600 mb-6">{project.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">
                        <span className="text-blue-600">Budget:</span> ${project.budget}
                      </p>
                      <p className="text-gray-700 font-medium">
                        <span className="text-blue-600">Timeline:</span> {project.timeline} days
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">
                        <span className="text-blue-600">Client:</span> {project.client_address}
                      </p>
                      <p className="text-gray-700 font-medium">
                        <span className="text-blue-600">Status:</span> 
                        <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {project.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
