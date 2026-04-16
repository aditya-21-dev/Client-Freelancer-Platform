import { Router } from 'express'
import { login, register, googleAuth } from '../controllers/authController.js'

const router = Router()

// Email/Password Auth
router.post('/register', register)
router.post('/login', login)

// ✅ Google Auth (IMPORTANT)
router.post('/google', googleAuth)

export default router