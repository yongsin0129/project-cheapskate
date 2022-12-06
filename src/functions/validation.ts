import Joi from 'joi'

export interface RegisterInputData {
  email: string
  password: string
}

export interface LoginInputData {
  email: string
  password: string
  password_confirmation: string
}

// Register Validation
export const registerValidation = (registerInputData: RegisterInputData) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required()
  })

  return schema.validate(registerInputData)
}

// login Validation
export const loginValidation = (loginInputData: LoginInputData) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
    password_confirmation: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .label('Confirm password')
      .messages({ 'any.only': '{{#label}} does not match' })
  })
  return schema.validate(loginInputData)
}
