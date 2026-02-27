import express from 'express'
import asyncHandler from '../utils/asyncHandler'
import { registerController } from '../controllers/userController'

const router = express.Router()

router.post('/register', asyncHandler(registerController))

export default router