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
import swaggerUi from 'swagger-ui-express'
import swaggerFile from '../swagger_output.json' // 剛剛輸出的 JSON

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', api)
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerFile))

const server = app.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:${port}`)
)
