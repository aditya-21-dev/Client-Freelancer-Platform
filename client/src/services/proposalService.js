import axiosClient from '../utils/axiosClient'

export const createProposal = async ({ jobId, text }) => {
  const { data } = await axiosClient.post('/api/proposals', { jobId, text })
  return data
}

export const fetchClientProposals = async () => {
  const { data } = await axiosClient.get('/api/proposals/client')
  return data
}

export const fetchFreelancerProposals = async () => {
  const { data } = await axiosClient.get('/api/proposals/freelancer')
  return data
}

export const updateProposalStatus = async ({ proposalId, status, amount }) => {
  const { data } = await axiosClient.put(`/api/proposals/${proposalId}/status`, {
    status,
    amount,
  })
  return data
}
