import mongoose from 'mongoose'
import { addEarnings } from './earningsController.js'
import Job from '../models/Job.js'
import Message from '../models/Message.js'
import Payment from '../models/Payment.js'
import Proposal from '../models/Proposal.js'
import Submission from '../models/Submission.js'

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value)
const getConversationId = (firstUserId, secondUserId) =>
  [String(firstUserId), String(secondUserId)].sort().join('*')

const buildFileUrl = (req, filename) => `${req.protocol}://${req.get('host')}/uploads/${filename}`

export const createSubmission = async (req, res) => {
  try {
    const freelancerId = req.user?.id || req.user?._id
    const { jobId, message } = req.body || {}
    const normalizedMessage = typeof message === 'string' ? message.trim() : ''

    if (!freelancerId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!jobId || !isValidObjectId(jobId)) {
      return res.status(400).json({ message: 'Invalid job id' })
    }

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' })
    }

    const acceptedProposal = await Proposal.findOne({
      job: jobId,
      freelancer: freelancerId,
      status: 'accepted',
    }).select('_id')

    if (!acceptedProposal) {
      return res.status(403).json({ message: 'You are not assigned to this job' })
    }

    const job = await Job.findById(jobId).select('_id')
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    const fileUrl = buildFileUrl(req, req.file.filename)

    const submission = await Submission.create({
      jobId,
      freelancerId,
      fileUrl,
      message: normalizedMessage,
      status: 'submitted',
      revisionMessage: '',
    })

    const populatedSubmission = await Submission.findById(submission._id)
      .populate('freelancerId', 'name email')
      .populate('jobId', 'title')

    return res.status(201).json(populatedSubmission)
  } catch (error) {
    console.error('[submission.createSubmission] error', error)
    return res.status(500).json({ message: 'Failed to create submission' })
  }
}

export const getSubmissionsByJob = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id
    const userRole = req.user?.role
    const { jobId } = req.params

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!jobId || !isValidObjectId(jobId)) {
      return res.status(400).json({ message: 'Invalid job id' })
    }

    const job = await Job.findById(jobId).select('_id client')
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    if (userRole === 'client' && String(job.client) !== String(userId)) {
      return res.status(403).json({ message: 'You are not allowed to view these submissions' })
    }

    if (userRole === 'freelancer') {
      const acceptedProposal = await Proposal.findOne({
        job: jobId,
        freelancer: userId,
        status: 'accepted',
      }).select('_id')

      if (!acceptedProposal) {
        return res.status(403).json({ message: 'You are not allowed to view these submissions' })
      }
    }

    const submissions = await Submission.find({ jobId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 })

    return res.status(200).json(submissions)
  } catch (error) {
    console.error('[submission.getSubmissionsByJob] error', error)
    return res.status(500).json({ message: 'Failed to fetch submissions' })
  }
}

export const getClientSubmissions = async (req, res) => {
  try {
    const clientId = req.user?.id || req.user?._id

    if (!clientId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (req.user?.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can access this resource' })
    }

    const clientJobs = await Job.find({ client: clientId }).select('_id')
    const jobIds = clientJobs.map((job) => job._id)

    if (jobIds.length === 0) {
      return res.status(200).json([])
    }

    const submissions = await Submission.find({ jobId: { $in: jobIds } })
      .populate('freelancerId', 'name email')
      .populate('jobId', 'title budget')
      .sort({ createdAt: -1 })

    const response = submissions.map((submission) => ({
      _id: submission._id,
      job: submission.jobId
        ? {
            _id: submission.jobId._id,
            title: submission.jobId.title,
            budget: submission.jobId.budget,
          }
        : null,
      freelancer: submission.freelancerId
        ? {
            _id: submission.freelancerId._id,
            name: submission.freelancerId.name,
            email: submission.freelancerId.email,
          }
        : null,
      fileUrl: submission.fileUrl,
      message: submission.message,
      revisionMessage: submission.revisionMessage || '',
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
      status: submission.status || 'submitted',
    }))

    return res.status(200).json(response)
  } catch (error) {
    console.error('[submission.getClientSubmissions] error', error)
    return res.status(500).json({ message: 'Failed to fetch client submissions' })
  }
}

export const approveSubmission = async (req, res) => {
  try {
    const clientId = req.user?.id || req.user?._id
    const { id } = req.params

    if (!clientId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (req.user?.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can approve submissions' })
    }

    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid submission id' })
    }

    const submission = await Submission.findById(id)
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' })
    }

    const job = await Job.findById(submission.jobId).select('_id client budget')
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    if (String(job.client) !== String(clientId)) {
      return res.status(403).json({ message: 'You are not allowed to approve this submission' })
    }

    const wasAlreadyApproved = submission.status === 'approved'

    if (!wasAlreadyApproved) {
      submission.status = 'approved'
      submission.revisionMessage = ''
      await submission.save()
    }

    const acceptedProposal = await Proposal.findOne({
      job: submission.jobId,
      freelancer: submission.freelancerId,
      status: 'accepted',
    }).select('_id')

    if (!acceptedProposal) {
      return res.status(400).json({ message: 'Accepted proposal not found for this submission' })
    }

    const paymentAmount = Number(job.budget || 0)

    const payment = await Payment.findOneAndUpdate(
      { proposal: acceptedProposal._id },
      {
        proposal: acceptedProposal._id,
        job: submission.jobId,
        client: job.client,
        freelancer: submission.freelancerId,
        amount: paymentAmount,
        status: 'released',
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    )

    if (!wasAlreadyApproved && paymentAmount > 0) {
      await addEarnings(submission.freelancerId, paymentAmount)
    }

    return res.status(200).json({
      message: 'Submission approved successfully',
      submission,
      payment,
    })
  } catch (error) {
    console.error('[submission.approveSubmission] error', error)
    return res.status(500).json({ message: 'Failed to approve submission' })
  }
}

export const requestRevision = async (req, res) => {
  try {
    const clientId = req.user?.id || req.user?._id
    const { id } = req.params
    const { revisionMessage } = req.body || {}
    const normalizedMessage = typeof revisionMessage === 'string' ? revisionMessage.trim() : ''

    if (!clientId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (req.user?.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can request revisions' })
    }

    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid submission id' })
    }

    if (!normalizedMessage) {
      return res.status(400).json({ message: 'Revision message is required' })
    }

    const submission = await Submission.findById(id)
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' })
    }

    const job = await Job.findById(submission.jobId).select('_id client')
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    if (String(job.client) !== String(clientId)) {
      return res.status(403).json({ message: 'You are not allowed to request revision for this submission' })
    }

    if (submission.status === 'approved') {
      return res.status(400).json({ message: 'Approved submission cannot be moved to revision' })
    }

    submission.status = 'revision'
    submission.revisionMessage = normalizedMessage
    await submission.save()

    await Message.create({
      sender: clientId,
      receiver: submission.freelancerId,
      conversationId: getConversationId(clientId, submission.freelancerId),
      jobId: job._id,
      text: normalizedMessage,
      type: 'revision',
    })

    return res.status(200).json({
      message: 'Revision requested successfully',
      submission,
    })
  } catch (error) {
    console.error('[submission.requestRevision] error', error)
    return res.status(500).json({ message: 'Failed to request revision' })
  }
}
