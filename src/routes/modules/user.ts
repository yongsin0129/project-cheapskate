import express from 'express'
import { ErrorRequestHandler, Request, Response, NextFunction } from 'express'
const router = express.Router()
import passport from 'passport'
import { userController } from '../../controllers/user-controller'

/********************************************************************************
*
          router
*
*********************************************************************************/
router.post('/signUp', userController.register)

router.post('/signIn', userController.signIn)

router.get('/test', function (req, res, next) {
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
    // If authentication failed, `user` will be set to false. If an exception occurred, `err` will be set.
    if (err || !user) {
      // PASS THE ERROR OBJECT TO THE NEXT ROUTE i.e THE APP'S COMMON ERROR HANDLING MIDDLEWARE
      return next(info)
    } else {
      req.user = user
      userController.test(req, res, next)
    }
  })(req, res, next)
})

export default router
