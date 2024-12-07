import type { NextApiRequest, NextApiResponse } from 'next';
import { getProjectsByFreelancer } from '@/utils/tableland';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // console.log("test")
    const { address } = req.query;
    if (!address) {
      return res.status(400).json({ message: 'Address is required' });
    }

    const projects = await getProjectsByFreelancer(address as string);
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ message: 'Failed to fetch projects' });
  }
}
