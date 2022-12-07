import { Request, Response, NextFunction } from 'express'
import * as validator from '../functions/validation'
import response from '../functions/response'
import { userSignUp, userSignIn } from '../functions/user-functions'

export const userController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    // 獲取 req.body
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

    // 執行使用者註冊
    const result = await userSignUp(req)
    return res.status(result.responseStatusCode).json(result.responseObj)
  },

  signIn: async (req: Request, res: Response, next: NextFunction) => {
    // 獲取 req.body
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

    // 執行使用者登入
    const result = await userSignIn(req)
    return res.status(result.responseStatusCode).json(result.responseObj)
  },

  test: async (req: Request, res: Response, next: NextFunction) => {
    res.send(req.user)
  }
}
