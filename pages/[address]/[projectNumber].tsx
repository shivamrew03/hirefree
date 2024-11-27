import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { projectService } from '@/services/projectService';
import { Button } from '@/components/common';
import type { Project, Milestone } from '@/types/project';

export default function ProjectDetail() {
  const router = useRouter();
  const { address, projectNumber } = router.query;
  const [project, setProject] = useState<Project>();

  useEffect(() => {
    if (address && projectNumber) {
      projectService.fetchProjectDetails(projectNumber as string)
        .then(setProject);
    }
  }, [address, projectNumber]);

  const handleCreateInvoice = () => {
    router.push({
      pathname: '/create-invoice',
      query: {
        projectId: projectNumber,
        client: project?.clientAddress,
        chain: project?.paymentChain,
        currency: project?.currency,
        description: `Milestone completion for Project #${projectNumber}`,
        amount: project?.nextMilestone?.amount
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Project #{projectNumber}: {project?.name}</h1>
      <div className="mb-6">
        <h2 className="text-xl mb-2">Description</h2>
        <p>{project?.description}</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl mb-2">Milestones</h2>
        {project?.milestones.map((milestone: Milestone, index: number) => (
          <div key={index} className="p-4 border rounded-lg mb-2">
            <div className="flex justify-between items-center">
              <span>{milestone.name}</span>
              <span>{milestone.amount} {project.currency}</span>
              {milestone.completed && <span className="text-green">Completed</span>}
            </div>
          </div>
        ))}
      </div>

      {/* <Button onClick={handleCreateInvoice}>
        Create Invoice for Next Milestone
      </Button> */}
    </div>
  );
}
