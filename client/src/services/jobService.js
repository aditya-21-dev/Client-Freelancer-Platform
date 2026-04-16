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
