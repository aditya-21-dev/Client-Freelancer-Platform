import { Router } from 'express'
import { createJob, getJobById, getJobs } from '../controllers/jobController.js'
import { authorizeRoles, protect } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', getJobs)
router.get('/:id', getJobById)
router.post('/', protect, authorizeRoles('client'), createJob)

export default router
