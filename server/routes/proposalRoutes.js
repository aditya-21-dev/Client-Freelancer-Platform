import { Router } from 'express'
import {
  createProposal,
  getClientProposals,
  getFreelancerProposals,
  updateProposalStatus,
} from '../controllers/proposalController.js'
import { authorizeRoles, protect } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/', protect, authorizeRoles('freelancer'), createProposal)
router.get('/client', protect, authorizeRoles('client'), getClientProposals)
router.get('/freelancer', protect, authorizeRoles('freelancer'), getFreelancerProposals)
router.put('/:id/status', protect, authorizeRoles('client'), updateProposalStatus)

export default router
