import { Router } from 'express'
import { getUsers, updateUserProfile } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', protect, getUsers)
router.put('/profile', protect, updateUserProfile)

export default router
