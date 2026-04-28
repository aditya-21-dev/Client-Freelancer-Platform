import { getJson, sendJson } from '../utils/api'

export const createJob = async ({ title, description, budget, deadline }) => {
  return sendJson('/api/jobs', {
    method: 'POST',
    body: {
      title,
      description,
      budget,
      deadline,
    },
  })
}

export const fetchJobs = async () => {
  return getJson('/api/jobs')
}

export const fetchJobById = async (id) => {
  return getJson(`/api/jobs/${id}`)
}

export const fetchClientJobs = async () => {
  return getJson('/api/jobs/client/me')
}

export const fetchFreelancerJobs = async () => {
  return getJson('/api/jobs/freelancer/me')
}

export const submitJobProject = async ({ jobId, file, status = 'submitted', message = '' }) => {
  return sendJson(`/api/jobs/${jobId}/submit`, {
    method: 'PUT',
    body: { file, status, message },
  })
}

export const acceptJobProject = async (jobId) => {
  return sendJson(`/api/jobs/${jobId}/accept`, {
    method: 'PUT',
  })
}

export const requestJobRevision = async ({ jobId, text }) => {
  return sendJson(`/api/jobs/${jobId}/revision`, {
    method: 'PUT',
    body: { text },
  })
}
