import mongoose from 'mongoose'
import Job from '../models/Job.js'
import Proposal from '../models/Proposal.js'
import Payment from '../models/Payment.js'

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value)

export const createProposal = async (req, res) => {
  try {
    const freelancerId = req.user?._id
    const { jobId, text } = req.body || {}
    const normalizedText = typeof text === 'string' ? text.trim() : ''

    if (!freelancerId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!jobId || !isValidObjectId(jobId)) {
      return res.status(400).json({ message: 'Invalid job id' })
    }

    if (!normalizedText) {
      return res.status(400).json({ message: 'Proposal text is required' })
    }

    const job = await Job.findById(jobId).select('_id client budget')
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    const proposal = await Proposal.create({
      job: job._id,
      freelancer: freelancerId,
      client: job.client,
      text: normalizedText,
      status: 'pending',
    })

    const populated = await Proposal.findById(proposal._id)
      .populate('job', 'title budget deadline')
      .populate('freelancer', 'name email')
      .populate('client', 'name email')

    return res.status(201).json(populated)
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'You have already submitted a proposal for this job' })
    }
    return res.status(500).json({ message: 'Failed to create proposal' })
  }
}

export const getClientProposals = async (req, res) => {
  try {
    const clientId = req.user?._id
    if (!clientId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const proposals = await Proposal.find({ client: clientId })
      .populate('job', 'title budget deadline')
      .populate('freelancer', 'name email')
      .sort({ createdAt: -1 })

    return res.status(200).json(proposals)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch proposals' })
  }
}

export const getFreelancerProposals = async (req, res) => {
  try {
    const freelancerId = req.user?._id
    if (!freelancerId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const proposals = await Proposal.find({ freelancer: freelancerId })
      .populate('job', 'title budget deadline')
      .populate('client', 'name email')
      .sort({ createdAt: -1 })

    return res.status(200).json(proposals)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch proposals' })
  }
}

export const updateProposalStatus = async (req, res) => {
  try {
    const clientId = req.user?._id
    const { id } = req.params
    const { status } = req.body || {}

    if (!clientId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid proposal id' })
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const proposal = await Proposal.findOne({ _id: id, client: clientId }).populate(
      'job',
      'budget title',
    )
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' })
    }

    proposal.status = status
    await proposal.save()

    if (status === 'accepted') {
      await Payment.findOneAndUpdate(
        { proposal: proposal._id },
        {
          $setOnInsert: {
            proposal: proposal._id,
            job: proposal.job?._id || proposal.job,
            client: proposal.client,
            freelancer: proposal.freelancer,
            amount: Number(proposal.job?.budget || 0),
            status: 'escrowed',
          },
        },
        { upsert: true, new: true },
      )
    }

    const populated = await Proposal.findById(proposal._id)
      .populate('job', 'title budget deadline')
      .populate('freelancer', 'name email')
      .populate('client', 'name email')

    return res.status(200).json(populated)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update proposal status' })
  }
}
