import passport from 'passport'
import * as passport_jwt from 'passport-jwt'
import { ExtractJwt } from 'passport-jwt'
const JwtStrategy = passport_jwt.Strategy

interface JwtPayLoad {
  id: string
  email: string
}

export const passportInit = (passport: passport.PassportStatic) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.jwt_Secret
  }

  passport.use(
    new JwtStrategy(opts, function (jwt_payload: JwtPayLoad, done) {
      const user = jwt_payload
      return done(null, user)
    })
  )
}
