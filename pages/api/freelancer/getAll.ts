import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllFreelancers } from '@/utils/tableland';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const freelancers = await getAllFreelancers();
    return res.status(200).json(freelancers);
  } catch (error) {
    console.error('Error fetching freelancers:', error);
    return res.status(500).json({ message: 'Failed to fetch freelancers' });
  }
} 