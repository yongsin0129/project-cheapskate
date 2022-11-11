console.log('server env.NODE_ENV : ' + process.env.NODE_ENV)
import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
import { Prisma, PrismaClient, Status } from '@prisma/client'
import express from 'express'

const port = process.env.PORT
const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.get('/createData', async (req, res, next) => {
  const newMovieData = await prisma.movieList.create({
    data: {
      title: '黑豹2：瓦干達萬歲',
      releaseDate: '2022/11/09',
      url:'http://www.atmovies.com.tw/movie/fben29114286/',
      status:Status.firstRound
    }
  })
  res.send(newMovieData)
})

app.get('/', async (req, res) => {
  res.send('this is project-cheapskate')
})

const server = app.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:${port}`)
)
