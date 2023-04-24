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
      // 這邊 JwtStrategy 會驗證 JWT 的完整性，錯誤則 next(info),不會進入 verify function
      
      // 正常的設計，這邊會被 JWT 解析出來的 user 跟資料庫的比對，但為了不增加 server 與 資料庫的 loading , 這邊直接 return user
      const user = jwt_payload
      return done(null, user)
    })
  )
}
