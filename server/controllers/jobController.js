import mongoose from 'mongoose'
import Job from '../models/Job.js'
import Proposal from '../models/Proposal.js'
import Submission from '../models/Submission.js'

const validateCreateJobPayload = ({ title, description, budget, deadline }) => {
  if (!title || typeof title !== 'string' || !title.trim()) {
    return 'Title is required'
  }

  if (!description || typeof description !== 'string' || !description.trim()) {
    return 'Description is required'
  }

  const budgetNumber = Number(budget)
  if (Number.isNaN(budgetNumber) || budgetNumber < 0) {
    return 'Budget must be a valid positive number'
  }

  const parsedDeadline = new Date(deadline)
  if (!deadline || Number.isNaN(parsedDeadline.getTime())) {
    return 'Deadline must be a valid date'
  }

  return null
}

export const createJob = async (req, res) => {
  try {
    const validationError = validateCreateJobPayload(req.body || {})
    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const { title, description, budget, deadline } = req.body

    const job = await Job.create({
      title: title.trim(),
      description: description.trim(),
      budget: Number(budget),
      deadline: new Date(deadline),
      client: req.user._id,
      submission: {
        file: '',
        submittedAt: null,
        status: 'pending',
      },
      submissionMessages: [],
    })

    return res.status(201).json(job)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create job' })
  }
}

export const getJobs = async (_req, res) => {
  try {
    const jobs = await Job.find({})
      .populate('client', 'name email role')
      .sort({ createdAt: -1 })

    return res.status(200).json(jobs)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch jobs' })
  }
}

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid job id' })
    }

    const job = await Job.findById(id).populate('client', 'name email role')

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    return res.status(200).json(job)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch job' })
  }
}

export const getClientJobsWithProposalCount = async (req, res) => {
  try {
    const clientId = req.user?._id
    if (!clientId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const jobs = await Job.find({ client: clientId })
      .select('_id title description budget deadline createdAt')
      .sort({ createdAt: -1 })

    const jobIds = jobs.map((job) => job._id)

    const proposalCounts = await Proposal.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$job', count: { $sum: 1 } } },
    ])

    const countMap = new Map(
      proposalCounts.map((item) => [String(item._id), item.count]),
    )

    const response = jobs.map((job) => ({
      ...job.toObject(),
      proposalsCount: countMap.get(String(job._id)) || 0,
    }))

    return res.status(200).json(response)
  } catch (error) {
    console.error('[job.getClientJobsWithProposalCount] error', error)
    return res.status(500).json({ message: 'Failed to fetch client jobs' })
  }
}

export const getFreelancerJobs = async (req, res) => {
  try {
    const freelancerId = req.user?._id
    if (!freelancerId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const acceptedProposals = await Proposal.find({
      freelancer: freelancerId,
      status: 'accepted',
    }).select('job')

    const acceptedJobIds = [...new Set(acceptedProposals.map((proposal) => String(proposal.job)))]

    if (acceptedJobIds.length === 0) {
      return res.status(200).json([])
    }

    const jobs = await Job.find({ _id: { $in: acceptedJobIds } })
      .populate('client', 'name email')
      .sort({ createdAt: -1 })

    const submissions = await Submission.find({
      freelancerId,
      jobId: { $in: acceptedJobIds },
    })
      .select('jobId status createdAt updatedAt')
      .sort({ createdAt: -1 })

    const latestSubmissionByJob = new Map()
    for (const submission of submissions) {
      const key = String(submission.jobId)
      if (!latestSubmissionByJob.has(key)) {
        latestSubmissionByJob.set(key, submission)
      }
    }

    const response = jobs.map((job) => {
      const latestSubmission = latestSubmissionByJob.get(String(job._id))
      return {
        ...job.toObject(),
        submissionStatus: latestSubmission?.status || 'pending',
        latestSubmissionId: latestSubmission?._id || null,
      }
    })

    return res.status(200).json(response)
  } catch (error) {
    console.error('[job.getFreelancerJobs] error', error)
    return res.status(500).json({ message: 'Failed to fetch freelancer jobs' })
  }
}

export const submitJobProject = async (req, res) => {
  try {
    const { id } = req.params
    const freelancerId = req.user?._id
    const { file, status, message } = req.body || {}
    const normalizedFile = typeof file === 'string' ? file.trim() : ''
    const normalizedMessage = typeof message === 'string' ? message.trim() : ''

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid job id' })
    }

    const acceptedProposal = await Proposal.findOne({
      job: id,
      freelancer: freelancerId,
      status: 'accepted',
    }).select('_id')

    if (!acceptedProposal) {
      return res.status(403).json({ message: 'You are not assigned to this job' })
    }

    const job = await Job.findById(id).populate('client', 'name email')
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    if (normalizedFile) {
      job.submission.file = normalizedFile
    }

    if (!job.submission?.file) {
      return res.status(400).json({ message: 'File is required before submission' })
    }

    job.submission.submittedAt = new Date()
    job.submission.status = status === 'submitted' ? 'submitted' : 'submitted'

    if (normalizedMessage) {
      job.submissionMessages = [
        ...(job.submissionMessages || []),
        {
          sender: 'freelancer',
          text: normalizedMessage,
          createdAt: new Date(),
        },
      ]
    }

    await job.save()
    console.log('[job.submitJobProject] submitted', {
      jobId: job._id.toString(),
      freelancerId: freelancerId?.toString?.() || String(freelancerId),
      file: job.submission.file,
      status: job.submission.status,
    })

    return res.status(200).json(job)
  } catch (error) {
    console.error('[job.submitJobProject] error', error)
    return res.status(500).json({ message: 'Failed to submit project' })
  }
}

export const acceptJobProject = async (req, res) => {
  try {
    const { id } = req.params
    const clientId = req.user?._id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid job id' })
    }

    const job = await Job.findOne({ _id: id, client: clientId }).populate('client', 'name email')
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    job.submission.status = 'completed'
    await job.save()

    console.log('[job.acceptJobProject] completed', {
      jobId: job._id.toString(),
      clientId: clientId?.toString?.() || String(clientId),
    })

    return res.status(200).json(job)
  } catch (error) {
    console.error('[job.acceptJobProject] error', error)
    return res.status(500).json({ message: 'Failed to accept project' })
  }
}

export const requestJobRevision = async (req, res) => {
  try {
    const { id } = req.params
    const clientId = req.user?._id
    const { text } = req.body || {}
    const normalizedText = typeof text === 'string' ? text.trim() : ''

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid job id' })
    }

    if (!normalizedText) {
      return res.status(400).json({ message: 'Revision message is required' })
    }

    const job = await Job.findOne({ _id: id, client: clientId }).populate('client', 'name email')
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    job.submission.status = 'revision'
    job.submissionMessages = [
      ...(job.submissionMessages || []),
      {
        sender: 'client',
        text: normalizedText,
        createdAt: new Date(),
      },
    ]

    await job.save()
    console.log('[job.requestJobRevision] revision requested', {
      jobId: job._id.toString(),
      clientId: clientId?.toString?.() || String(clientId),
    })

    return res.status(200).json(job)
  } catch (error) {
    console.error('[job.requestJobRevision] error', error)
    return res.status(500).json({ message: 'Failed to request revision' })
  }
}
