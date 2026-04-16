import { Router } from 'express'
import { getClientDashboard } from '../controllers/clientController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = Router()

router.use(protect, authorizeRoles('client'))

router.get('/dashboard', getClientDashboard)

export default router
