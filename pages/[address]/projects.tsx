import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { projectService } from "@/services/projectService";
import type { Project } from "@/types/project";
import { useAccount } from "wagmi";
import Head from "next/head";
export default function Projects() {
  const router = useRouter();
  const { address } = useAccount();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (address) {
      projectService.fetchProjects(address as string).then(setProjects);
    }
  }, [address]);

  return (
    <>
      <Head>
        <title>HireFree</title>
      </Head>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Projects</h1>
        <div className="grid gap-4">
          {projects.map((project) => (
            <div
              key={project.number}
              onClick={() => router.push(`/${address}/${project.number}`)}
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <h2 className="font-semibold">
                #{project.number} - {project.name}
              </h2>
              <p className="text-gray-600">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
