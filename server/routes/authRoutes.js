import { Router } from 'express'
import { login, register, googleAuth, getMe } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

// Email/Password Auth
router.post('/register', register)
router.post('/login', login)

// ✅ Google Auth (IMPORTANT)
router.post('/google', googleAuth)
router.get('/me', protect, getMe)

export default router
