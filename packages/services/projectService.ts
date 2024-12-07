import axios from 'axios';
import { PINATA_CONFIG } from '@/utils/pinata-config';
import { Project } from '@/types/project';

const PINATA_API = 'https://api.pinata.cloud';

const headers = {
  Authorization: `Bearer ${PINATA_CONFIG.JWT}`
};

export const projectService = {
  async storeProject(project: Project): Promise<string> {
    try {
      const response = await axios.post(
        `${PINATA_API}/pinning/pinJSONToIPFS`,
        project,
        { headers }
      );
      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error storing project:', error);
      throw error;
    }
  },

  async fetchProjects(address: string): Promise<Project[]> {
    try {
      const response = await axios.get(
        `${PINATA_API}/data/pinList?metadata[keyvalues][freelancerAddress]={"value":"${address}","op":"eq"}`,
        { headers }
      );
      
      const projects: Project[] = await Promise.all(
        response.data.rows.map(async (pin: any) => {
          const projectData = await axios.get(`https://gateway.pinata.cloud/ipfs/${pin.ipfs_pin_hash}`);
          return projectData.data;
        })
      );
      
      return projects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  async fetchProjectDetails(projectHash: string): Promise<Project> {
    try {
      const response = await axios.get(
        `https://gateway.pinata.cloud/ipfs/${projectHash}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching project details:', error);
      throw error;
    }
  },

  async updateProject(projectHash: string, updatedProject: Project): Promise<string> {
    try {
      // First, unpin the old version
      await axios.delete(
        `${PINATA_API}/pinning/unpin/${projectHash}`,
        { headers }
      );

      // Then store the updated version
      return await this.storeProject(updatedProject);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }
};
