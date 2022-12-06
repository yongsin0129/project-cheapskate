import { Request, Response, NextFunction } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as validator from '../functions/validation'
import response from '../functions/response'

export const userController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    // req.body
    const registerInputData: validator.RegisterInputData = {
      email: req.body.email,
      password: req.body.password,
      password_confirmation: req.body.password_confirmation
    }

    // 使用 validation
    const { error } = validator.registerValidation(registerInputData)
    if (error) {
      return new response({
        responseStatusCode: 400,
        error: error,
        message: error.details[0].message
      }).sendResToClient(res)
    }

    // 查詢 此 email 有無使用
    const user = await prisma.user.findUnique({
      where: { email: req.body.email }
    })
    if (user) {
      return new response({
        responseStatusCode: 400,
        message: '此 email 已經註冊過了 !!'
      }).sendResToClient(res)
    } else {
      try {
        const createdUser = await prisma.user.create({
          data: {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
          }
        })
        createdUser.password = ''
        return new response({
          responseStatusCode: 200,
          success: true,
          data: [{ createdUser }],
          message: '註冊成功 !!'
        }).sendResToClient(res)
      } catch (error) {
        return new response({
          responseStatusCode: 500,
          error: error
        }).sendResToClient(res)
      }
    }
  },

  signIn: async (req: Request, res: Response, next: NextFunction) => {
    // req.body
    const logInInputData: validator.LoginInputData = {
      email: req.body.email,
      password: req.body.password
    }

    // 使用 validation
    const { error } = validator.loginValidation(logInInputData)
    if (error)
      return new response({
        responseStatusCode: 400,
        error: error,
        message: error.details[0].message
      }).sendResToClient(res)

    // 查詢 email 使用者
    const user = await prisma.user.findUnique({
      where: { email: req.body.email }
    })
    if (!user)
      return new response({
        responseStatusCode: 400,
        message: '無此使用者'
      }).sendResToClient(res)

    bcrypt.compare(req.body.password, user.password).then(resultBoolean => {
      try {
        if (resultBoolean === false)
          return new response({
            responseStatusCode: 400,
            message: '密碼錯誤'
          }).sendResToClient(res)

        if (resultBoolean === true) {
          const tokenObject = { id: user.id, email: user.email }
          const jwtToken = jwt.sign(tokenObject, process.env.jwt_Secret!, {
            expiresIn: '30 days'
          })
          user.password = ''
          return new response({
            responseStatusCode: 200,
            success: true,
            data: [{ user, jwtToken }],
            message: '登入成功'
          }).sendResToClient(res)
        }
      } catch (error) {
        return new response({
          responseStatusCode: 500,
          error: error
        }).sendResToClient(res)
      }
    })
  },

  test: async (req: Request, res: Response, next: NextFunction) => {
    res.send(req.user)
  }
}
