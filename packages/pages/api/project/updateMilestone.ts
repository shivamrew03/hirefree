import { updateMilestoneStatus } from '../../../utils/tableland';
import { xmtpService } from '@/utils/xmtpService';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { projectId, milestoneIndex, clientAddress, freelancerAddress, milestoneName, milestoneAmount } = req.body;

  try {
    const result = await updateMilestoneStatus(projectId, milestoneIndex);

    // Send notification to client
    const notificationMessage = ` Milestone Completed!
    Project ID: ${projectId}
    Milestone: ${milestoneName}
    Amount Due: $${milestoneAmount}
    From: ${freelancerAddress}
    
    Please review and process the payment for this milestone through the Request Network invoice.`;

    await xmtpService.sendMessage(clientAddress, notificationMessage);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ success: false, message: 'Failed to update milestone' });
  }
}