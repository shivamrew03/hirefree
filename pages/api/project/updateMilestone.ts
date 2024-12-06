import { updateMilestoneStatus } from '../../../utils/tableland';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { projectId, milestoneIndex } = req.body;

  try {
    const result = await updateMilestoneStatus(projectId, milestoneIndex);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ success: false, message: 'Failed to update milestone' });
  }
}
