import express from 'express'
import asyncHandler from '../utils/asyncHandler'
import { loginController, registerController } from '../controllers/userController'

const router = express.Router()

router.post('/register', asyncHandler(registerController))
router.post('/login', asyncHandler(loginController))

export default router