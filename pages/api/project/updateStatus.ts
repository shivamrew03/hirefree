import { updateProjectStatus } from '../../../utils/tableland';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { projectId, status } = req.body;
    await updateProjectStatus(projectId, status);
    res.status(200).json({ message: 'Project status updated successfully' });
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({ message: 'Error updating project status' });
  }
}
