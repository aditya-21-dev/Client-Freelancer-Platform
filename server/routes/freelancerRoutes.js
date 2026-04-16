import { Router } from 'express'
import { getFreelancerDashboard } from '../controllers/freelancerController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = Router()

router.use(protect, authorizeRoles('freelancer'))

router.get('/dashboard', getFreelancerDashboard)

export default router
