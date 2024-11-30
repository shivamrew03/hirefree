import type { NextApiRequest, NextApiResponse } from 'next';
import { registerFreelancer, getFreelancerByAddress } from '../../../utils/tableland';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { 
      walletAddress,
      fullName, 
      email, 
      skills, 
      experience, 
      hourlyRate, 
      portfolio, 
      bio 
    } = req.body;

    // Basic validation
    if (!walletAddress || !fullName || !email || !skills || !experience || !hourlyRate || !bio) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Check if user already exists
    const existingUser = await getFreelancerByAddress(walletAddress);
    if (existingUser) {
      // console.log(existingUser)
      return res.status(400).json({ message: 'This wallet is already registered' });
    }
    console.log("not in database")
    // Register freelancer
    const result = await registerFreelancer({
      walletAddress,
      fullName,
      email,
      skills,
      experience,
      hourlyRate,
      portfolio,
      bio
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 