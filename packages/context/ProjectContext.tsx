import React, { createContext, useContext, useState } from 'react';
import { Project } from '@/types/project';
import { projectService } from '@/services/projectService';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  loadProjects: (address: string) => Promise<void>;
  loadProjectDetails: (hash: string) => Promise<void>;
  createProject: (project: Project) => Promise<string>;
  updateProject: (hash: string, project: Project) => Promise<string>;
}

const ProjectContext = createContext<ProjectContextType>({} as ProjectContextType);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const loadProjects = async (address: string) => {
    const fetchedProjects = await projectService.fetchProjects(address);
    setProjects(fetchedProjects);
  };

  const loadProjectDetails = async (hash: string) => {
    const project = await projectService.fetchProjectDetails(hash);
    setCurrentProject(project);
  };

  const createProject = async (project: Project) => {
    return await projectService.storeProject(project);
  };

  const updateProject = async (hash: string, project: Project) => {
    return await projectService.updateProject(hash, project);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        loadProjects,
        loadProjectDetails,
        createProject,
        updateProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);
