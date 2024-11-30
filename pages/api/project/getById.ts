import type { NextApiRequest, NextApiResponse } from 'next';
import { getProjectById } from '@/utils/tableland';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'Project ID is required' });
    }
    console.log("Get by id")
    const project = await getProjectById(id as string);
    return res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({ message: 'Failed to fetch project' });
  }
}
