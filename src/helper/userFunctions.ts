import { Request, Response, NextFunction } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import ResponseClass from '../dto/response'

export async function userSignUp (req: Request) {
  try {
    // 查詢 email 使用者
    const user = await prisma.user.findUnique({
      where: { email: req.body.email }
    })
    if (user) {
      return new ResponseClass({
        responseStatusCode: 400,
        message: '此 email 已經註冊過了 !!'
      })
    }
    // 若 email 無人使用，則註冊新的使用者
    else {
      const createdUser = await prisma.user.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10)
        }
      })
      createdUser.password = ''
      return new ResponseClass({
        responseStatusCode: 200,
        success: true,
        data: [{ createdUser }],
        message: '註冊成功 !!'
      })
    }
  } catch (error) {
    let errorMessage: string | null = null
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return new ResponseClass({
      responseStatusCode: 500,
      error: error,
      message: errorMessage || 'userSignIn 非預期錯誤'
    })
  }
}

export async function userSignIn (req: Request) {
  try {
    // 查詢 email 使用者
    const user = await prisma.user.findUnique({
      where: { email: req.body.email }
    })
    if (!user) {
      return new ResponseClass({
        responseStatusCode: 400,
        message: '無此使用者'
      })
    }

    // 使用 bcrypt 比對使用者密碼
    const bcryptResult = await bcrypt.compare(req.body.password, user.password)
    if (bcryptResult === false) {
      return new ResponseClass({
        responseStatusCode: 400,
        message: '密碼錯誤'
      })
    } else {
      const tokenObject = { id: user.id, email: user.email }
      const jwtToken = jwt.sign(tokenObject, process.env.jwt_Secret!, {
        expiresIn: '30 days'
      })
      user.password = ''
      return new ResponseClass({
        responseStatusCode: 200,
        success: true,
        data: [{ user, jwtToken }],
        message: '登入成功'
      })
    }
  } catch (error) {
    let errorMessage: string | null = null
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return new ResponseClass({
      responseStatusCode: 500,
      error: error,
      message: errorMessage || 'userSignIn 非預期錯誤'
    })
  }
}
