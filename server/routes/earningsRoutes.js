import { Router } from 'express'
import { getMyEarnings } from '../controllers/earningsController.js'
import { authorizeRoles, protect } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/me', protect, authorizeRoles('freelancer'), getMyEarnings)

export default router
