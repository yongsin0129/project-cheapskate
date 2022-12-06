console.log('server env.NODE_ENV : ' + process.env.NODE_ENV)
import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
import { Prisma, PrismaClient, Status } from '@prisma/client'
import express, { urlencoded } from 'express'
import api from './routes/routesIndex'

import passport from 'passport'
import { passportInit } from './config/passport'
passportInit(passport)

const port = process.env.PORT
const prisma = new PrismaClient()
const app = express()
const cors = require('cors')
app.use(cors({ origin: '*' }))

import swaggerUi from 'swagger-ui-express'
import swaggerFile from '../swagger_output.json' // 剛剛輸出的 JSON

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', api)
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerFile))

const server = app.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:${port}`)
)

// 如果遇到 cors 問題再來使用
// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', 'project-cheapskate-yongsin0129.vercel.app') // update to match the domain you will make the request from
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   )
//   next()
// })
