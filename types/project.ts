export interface Milestone {
  name: string;
  amount: number;
  completed: boolean;
  description: string;
}

export interface Project {
  number: string;
  name: string;
  description: string;
  clientAddress: string;
  freelancerAddress: string;
  paymentChain: string;
  currency: string;
  milestones: Milestone[];
  nextMilestone: Milestone;
  totalAmount: number;
  createdAt: string;
  status: 'active' | 'completed';
}
