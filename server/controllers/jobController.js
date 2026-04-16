import mongoose from 'mongoose'
import Job from '../models/Job.js'

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
