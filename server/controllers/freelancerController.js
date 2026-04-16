export const getFreelancerDashboard = async (req, res) => {
  return res.status(200).json({
    message: 'Freelancer dashboard data fetched successfully',
    role: req.user.role,
    data: {
      browseProjects: [
        {
          id: 'p-1001',
          title: 'Landing Page Redesign',
          budget: '$400 - $600',
        },
        {
          id: 'p-1015',
          title: 'MERN Admin Panel',
          budget: '$900 - $1200',
        },
      ],
      myProposals: [
        {
          id: 'pr-510',
          projectId: 'p-1015',
          status: 'pending',
        },
      ],
      earnings: {
        total: 0,
        currency: 'USD',
      },
    },
  })
}
