import axios from 'axios';
import { PINATA_CONFIG, getAuthHeader } from './pinata-config';
import { Project } from '@/types/project';

export async function fetchIPFSProjects(address: string): Promise<Project[]> {
  const response = await axios.get(
    `${PINATA_CONFIG.baseURL}/data/pinList?metadata[keyvalues][freelancerAddress]={"value":"${address}","op":"eq"}`,
    getAuthHeader()
  );
  
  const projects = await Promise.all(
    response.data.rows.map(async (pin: any) => {
      const projectData = await axios.get(`${PINATA_CONFIG.gateway}/${pin.ipfs_pin_hash}`);
      return projectData.data;
    })
  );
  
  return projects;
}

export async function fetchProjectDetails(address: string, projectNumber: string): Promise<Project | null> {
  const projects = await fetchIPFSProjects(address);
  return projects.find(p => p.number === projectNumber) || null;
}

export async function storeProjectData(project: Project): Promise<string> {
  const response = await axios.post(
    `${PINATA_CONFIG.baseURL}/pinning/pinJSONToIPFS`,
    project,
    getAuthHeader()
  );
  return response.data.IpfsHash;
}
