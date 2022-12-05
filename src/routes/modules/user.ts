import express from 'express'
import { Request, Response, NextFunction } from 'express'
const router = express.Router()
const passport = require('passport')
import { userController } from '../../controllers/user-controller'
/********************************************************************************
*
          router
*
*********************************************************************************/
router.post('/signUp', userController.register)

router.post('/signIn', userController.signIn)

router.get(
  '/test',
  passport.authenticate('jwt', { session: false }),
  userController.test
)

export default router
