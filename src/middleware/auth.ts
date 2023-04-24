import passport from 'passport'
import { Request, Response, NextFunction } from 'express'

interface User {
  id: string
  email: string
  iat: number
  exp: number
}

interface Info {
  name: string
  message: string
}

export function jwtAuthenticate (
  req: Request,
  res: Response,
  next: NextFunction
) {
  passport.authenticate(
    'jwt',
    { session: false },
    function (err: Error | null, user: User, info: Info | undefined) {
      // If authentication failed, `user` will be set to false. If an exception occurred, `err` will be set.
      if (err || !user) {
        // PASS THE ERROR OBJECT TO THE NEXT ROUTE i.e THE APP'S COMMON ERROR HANDLING MIDDLEWARE
        return next(info)
      } else {
        req.user = user
        next()
      }
    }
  )(req, res, next)
}
