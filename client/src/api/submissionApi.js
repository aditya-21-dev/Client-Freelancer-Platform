import axiosClient from '../utils/axiosClient'

const withOptionalAuth = (token) =>
  token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {}

export const createSubmission = async ({ jobId, file, message = '' }) => {
  const formData = new FormData()
  formData.append('jobId', jobId)
  formData.append('file', file)

  if (typeof message === 'string' && message.trim()) {
    formData.append('message', message.trim())
  }

  const { data } = await axiosClient.post('/api/submissions', formData)
  return data
}

export const uploadSubmission = async (formData, token) => {
  const { data } = await axiosClient.post('/api/submissions', formData, withOptionalAuth(token))
  return data
}

export const getSubmissionsByJob = async (jobId, token) => {
  const { data } = await axiosClient.get(`/api/submissions/job/${jobId}`, withOptionalAuth(token))
  return data
}

export const getClientSubmissions = async (token) => {
  const { data } = await axiosClient.get('/api/submissions/client', withOptionalAuth(token))
  return data
}

export const approveSubmission = async (submissionId, token) => {
  const { data } = await axiosClient.put(
    `/api/submissions/${submissionId}/approve`,
    {},
    withOptionalAuth(token),
  )
  return data
}

export const requestRevision = async ({ submissionId, revisionMessage }, token) => {
  const { data } = await axiosClient.put(
    `/api/submissions/${submissionId}/revision`,
    { revisionMessage },
    withOptionalAuth(token),
  )
  return data
}
