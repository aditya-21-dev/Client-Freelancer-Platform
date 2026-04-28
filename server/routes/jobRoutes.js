import { Router } from 'express'
import {
  acceptJobProject,
  createJob,
  getClientJobsWithProposalCount,
  getFreelancerJobs,
  getJobById,
  getJobs,
  requestJobRevision,
  submitJobProject,
} from '../controllers/jobController.js'
import { authorizeRoles, protect } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', getJobs)
router.get('/client/me', protect, authorizeRoles('client'), getClientJobsWithProposalCount)
router.get('/freelancer/me', protect, authorizeRoles('freelancer'), getFreelancerJobs)
router.get('/:id', getJobById)
router.post('/', protect, authorizeRoles('client'), createJob)
router.put('/:id/submit', protect, authorizeRoles('freelancer'), submitJobProject)
router.put('/:id/accept', protect, authorizeRoles('client'), acceptJobProject)
router.put('/:id/revision', protect, authorizeRoles('client'), requestJobRevision)

export default router
