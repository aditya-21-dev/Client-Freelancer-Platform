export const getClientDashboard = async (req, res) => {
  return res.status(200).json({
    message: 'Client dashboard data fetched successfully',
    role: req.user.role,
    data: {
      myProjects: [
        {
          id: 'p-1001',
          title: 'Landing Page Redesign',
          status: 'open',
        },
        {
          id: 'p-1002',
          title: 'Node API Performance Fixes',
          status: 'in_review',
        },
      ],
      proposals: [
        {
          id: 'pr-201',
          projectId: 'p-1001',
          freelancerName: 'Ava Morgan',
          bidAmount: 450,
        },
      ],
    },
  })
}
