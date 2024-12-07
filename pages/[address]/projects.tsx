import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import Head from "next/head";
import { motion } from "framer-motion";
import { Calendar, DollarSign, User, Clock, Tag } from "lucide-react";

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
          const response = await fetch(
            `/api/project/getByFreelancer?address=${address}`
          );
          const data = await response.json();

          if (Array.isArray(data)) {
            setProjects(data);
          } else {
            console.error("Invalid data format received:", data);
            setProjects([]);
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
          setProjects([]);
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
        freelancer_address: project.freelancer_address,
      },
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <>
      <Head>
        <title>My Projects - HireFree</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4"
        >
          <h1 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Projects
          </h1>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto"
            >
              {Array.isArray(projects) && projects.length > 0 ? (
                projects.map((project) => (
                  <motion.div
                    key={project.id}
                    variants={item}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleProjectClick(project)}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 px-8 py-6 cursor-pointer border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-800 truncate">
                        {project.title}
                      </h2>
                      <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 flex items-center">
                        <Tag className="w-4 h-4 mr-2" />
                        {project.status}
                      </span>
                    </div>  

                    <p className="text-gray-600 mb-5 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-700">
                          <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-medium">${project.budget}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Clock className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-medium">{project.timeline} days</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-700">
                          <User className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-medium truncate">
                            {project.client_address.slice(0, 10)}...
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-medium">
                            {new Date(project.timestamp * 1000).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center text-gray-600">
                  No projects found
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}
