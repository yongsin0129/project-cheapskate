import express from 'express'
const router = express.Router()
import passport from 'passport'
import { userController } from '../../controllers/user-controller'
import { jwtAuthenticate } from '../../middleware/auth'

/********************************************************************************
*
          router
*
*********************************************************************************/
router.post('/signUp', userController.register)

router.post('/signIn', userController.signIn)

router.get('/test', jwtAuthenticate, userController.test)

export default router
