import { Router } from 'express'
import { getMessages, sendMessage } from '../controllers/messageController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/', protect, sendMessage)
router.get('/:conversationId', protect, getMessages)

export default router
