import type { NextApiRequest, NextApiResponse } from 'next';
import { createProject } from '@/utils/tableland';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { 
      clientAddress,
      freelancerAddress,
      title,
      description,
      budget,
      timeline,
      milestones
    } = req.body;

    // Basic validation
    if (!clientAddress || !freelancerAddress || !title || !description || !budget || !timeline) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await createProject({
      client_address: clientAddress,
      freelancer_address: freelancerAddress,
      title,
      description,
      budget: Number(budget),
      timeline: Number(timeline),
      milestones: JSON.stringify(milestones),
      status: 'PENDING'
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
