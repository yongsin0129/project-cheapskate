import passport from 'passport'
import * as passport_jwt from 'passport-jwt'
import { ExtractJwt } from 'passport-jwt'
const JwtStrategy = passport_jwt.Strategy
import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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

      // 不要使用資料庫造成資料庫負擔
      // prisma.user
      //   .findUnique({
      //     where: { email: jwt_payload.email }
      //   })
      //   .then(user => {
      //     if (user) return done(null, user)
      //     else return done(null, false)
      //   })
      //   .catch(error => {
      //     return done(error, false)
      //   })
    })
  )
}
