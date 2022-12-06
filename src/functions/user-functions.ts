// import { Prisma, PrismaClient } from '@prisma/client'
// import bcrypt from 'bcryptjs'
// import * as validator from './validation'
// const prisma = new PrismaClient()

// main()
// async function main () {
//   const password = await bcrypt.hash('12345678', 10)

//   const registerInputData: validator.RegisterInputData = {
//     email: 'user2@example.com',
//     password: '12345678'
//   }

//   // 使用 validation
//   // const { error } = validator.registerValidation(registerInputData)
//   // if (error) {
//   //   console.log(error.details[0].message)
//   //   return
//   // }

//   // const createdUser = await prisma.user.create({
//   //   data: {
//   //     email: registerInputData.email,
//   //     password: bcrypt.hashSync(registerInputData.password,10)
//   //   }
//   // })
//   // console.log('createdUser : ', createdUser)

//   // // 密碼比對

//   const loginInputData: validator.LoginInputData = {
//     email: 'user2@example.com',
//     password: '12345678',
//     password_confirmation: '1234567'
//   }
//   // 使用 validation
//   const { error } = validator.loginValidation(loginInputData)
//   console.log(validator.loginValidation(loginInputData))
//   if (error) {
//     console.log(error.details[0].message)
//     return
//   }

//   // const findedUser = await prisma.user.findUnique({
//   //   where: {
//   //     email: 'user1@example.com'
//   //   }
//   // })
//   // console.log('findedUser : ', findedUser)

//   // const pw1 = '12345678'
//   // const pw2 = findedUser?.password

//   // bcrypt.compare(pw1, pw2!).then(res => {
//   //   console.log('res : ' + res)
//   // })

//   // prisma.$disconnect()
// }
