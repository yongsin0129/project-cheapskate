import express from 'express'
const router = express.Router()
import { userController } from '../../controllers/user-controller'
/********************************************************************************
*
          router
*
*********************************************************************************/
router.post('/signUp', userController.register)

export default router
