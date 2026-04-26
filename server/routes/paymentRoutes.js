import { Router } from 'express'
import { getClientPayments } from '../controllers/paymentController.js'
import { authorizeRoles, protect } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/client', protect, authorizeRoles('client'), getClientPayments)

export default router
