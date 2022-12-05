import express from 'express'
const router = express.Router()
import { userController } from '../../controllers/user-controller'
/********************************************************************************
*
          router
*
*********************************************************************************/
router.post('/signUp', userController.register)

router.post('/signIn', userController.signIn)

export default router
