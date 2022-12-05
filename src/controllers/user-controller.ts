import { Request, Response, NextFunction } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcryptjs'
import * as validator from '../functions/validation'
import {} from '../functions/user-functions'

export const userController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    // req.body
    const registerInputData: validator.RegisterInputData = {
      email: req.body.email,
      password: req.body.password
    }

    // 使用 validation
    const { error } = validator.registerValidation(registerInputData)
    if (error) return res.send(error.details[0].message)

    // 查詢 此 email 有無使用
    const user = await prisma.user.findUnique({
      where: { email: req.body.email }
    })
    if (user) return res.send('此 email 已經註冊過了 !!')
    else {
      try {
        const createdUser = await prisma.user.create({
          data: {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
          }
        })
        return res.send({ message: '成功註冊', user: createdUser })
      } catch (error) {
        return res.send(error)
      }
    }
  }
}
