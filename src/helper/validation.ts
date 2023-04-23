import Joi from 'joi'
import jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'

import * as Type from '../types'

export interface LoginInputData {
  email: string
  password: string
}

export interface RegisterInputData {
  email: string
  password: string
  password_confirmation: string
}

// Register Validation
export const registerValidation = (registerInputData: RegisterInputData) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
    password_confirmation: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .label('password_confirmation')
      .messages({ 'any.only': '{{#label}} does not match' })
  })

  return schema.validate(registerInputData)
}

// login Validation
export const loginValidation = (loginInputData: LoginInputData) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required()
  })
  return schema.validate(loginInputData)
}

export const decrypt_JWT_Token = (token: string | undefined) => {
  if (!token) return null
  try {
    return jwt.verify(token, process.env.jwt_Secret!) as Type.tokenPayload
  } catch (error) {
    throw new GraphQLError('jwt token verify failed')
  }
}
