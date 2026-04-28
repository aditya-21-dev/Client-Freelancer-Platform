import { Router } from 'express'
import {
  approveSubmission,
  createSubmission,
  getClientSubmissions,
  getSubmissionsByJob,
  requestRevision,
} from '../controllers/submissionController.js'
import { authorizeRoles, protect } from '../middleware/authMiddleware.js'
import upload from '../middleware/upload.js'

const router = Router()

router.post(
  '/',
  protect,
  authorizeRoles('freelancer'),
  upload.single('file'),  
  createSubmission,
)

router.get(
  '/client',
  protect,
  getClientSubmissions,
)

router.get(
  '/job/:jobId',
  protect,
  authorizeRoles('client', 'freelancer'),
  getSubmissionsByJob,
)

router.put(
  '/:id/approve',
  protect,
  approveSubmission,
)

router.put(
  '/:id/revision',
  protect,
  requestRevision,
)

export default router
