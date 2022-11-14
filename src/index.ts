console.log('server env.NODE_ENV : ' + process.env.NODE_ENV)
import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
import { Prisma, PrismaClient, Status } from '@prisma/client'
import express, { urlencoded } from 'express'
import api from './routes/routesIndex'

const port = process.env.PORT
const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', api)

app.get('/', async (req, res) => {
  res.send('this is project-cheapskate')
})

const server = app.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:${port}`)
)
