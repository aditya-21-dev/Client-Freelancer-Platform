const STORAGE_KEY = 'proposals'

const loadProposals = () => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveProposals = (proposals) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals))
  } catch {
    // ignore
  }
}

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export const createProposal = ({
  projectId,
  freelancerId,
  coverLetter,
  bidAmount,
  deliveryTime,
  attachments = [],
}) => {
  const proposals = loadProposals()
  const alreadyExists = proposals.some(
    (p) => p.projectId === projectId && p.freelancerId === freelancerId && p.status !== 'withdrawn',
  )

  if (alreadyExists) {
    const error = new Error('You have already submitted a proposal for this project')
    error.code = 'DUPLICATE_PROPOSAL'
    throw error
  }

  const now = new Date().toISOString()
  const proposal = {
    id: generateId(),
    projectId,
    freelancerId,
    coverLetter,
    bidAmount,
    deliveryTime,
    attachments,
    status: 'pending',
    createdAt: now,
  }

  proposals.push(proposal)
  saveProposals(proposals)
  return proposal
}

export const getProposalsByFreelancer = (freelancerId) => {
  return loadProposals().filter((p) => p.freelancerId === freelancerId)
}

export const getProposalsByProject = (projectId) => {
  return loadProposals().filter((p) => p.projectId === projectId)
}

export const getProposalById = (id) => {
  return loadProposals().find((p) => p.id === id) || null
}

export const updateProposalStatus = (id, status) => {
  const proposals = loadProposals()
  const idx = proposals.findIndex((p) => p.id === id)
  if (idx === -1) return null

  proposals[idx] = { ...proposals[idx], status }
  saveProposals(proposals)
  return proposals[idx]
}

export const withdrawProposal = (id) => {
  return updateProposalStatus(id, 'withdrawn')
}

