import express from 'express'
import { Prisma, PrismaClient, Status } from '@prisma/client'
const prisma = new PrismaClient()
const router = express.Router()

router.get('/', async (req, res) => {
  res.send('this route is deprected. try to use graphql api')
})

router.post('/', async (req, res) => {
  res.send('this route is deprected. try to use graphql api')
})

router.put('/', async (req, res) => {
  res.send('this route is deprected. try to use graphql api')
})

router.delete('/', async (req, res) => {
  res.send('this route is deprected. try to use graphql api')
})

export default router
