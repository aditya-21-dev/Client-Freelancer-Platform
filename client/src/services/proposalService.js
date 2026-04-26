import { getJson, sendJson } from '../utils/api'

export const createProposal = async ({ jobId, text }) => {
  return sendJson('/api/proposals', {
    method: 'POST',
    body: { jobId, text },
  })
}

export const fetchClientProposals = async () => {
  return getJson('/api/proposals/client')
}

export const fetchFreelancerProposals = async () => {
  return getJson('/api/proposals/freelancer')
}

export const updateProposalStatus = async ({ proposalId, status }) => {
  return sendJson(`/api/proposals/${proposalId}/status`, {
    method: 'PUT',
    body: { status },
  })
}
