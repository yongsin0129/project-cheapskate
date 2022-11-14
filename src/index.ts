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

// read
app.get('/readData', async (req, res, next) => {
  const movieData = await prisma.movieList.findMany()
  res.send(movieData)
})

// create
app.get('/createData', async (req, res, next) => {
  try {
    const newMovieData = await prisma.movieList.create({
      data: {
        title: '黑豹2：瓦干達萬歲',
        releaseDate: '2022/11/09',
        url: 'http://www.atmovies.com.tw/movie/fben29114286/',
        status: Status.firstRound
      }
    })
    res.send(newMovieData)
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error?.code === 'P2002'
    ) {
      const errorMsg = {
        ...error,
        msg:
          'There is a unique constraint violation, a new data cannot be created with this title & releaseDate'
      }
      res.send(errorMsg)
    }
  }
})

// update
app.get('/updateData', async (req, res, next) => {
  try {
    const updateMovieData = await prisma.movieList.update({
      where: {
        title_releaseDate: {
          title: '黑豹2：瓦干達萬歲',
          releaseDate: '2022/11/09'
        }
      },
      data: {
        status: Status.secondRound
      }
    })
    res.send(updateMovieData)
  } catch (error) {
    res.send(error)
  }
})

// delete
app.get('/deleteData', async (req, res, next) => {
  try {
    await prisma.movieList.delete({
      where: {
        title_releaseDate: {
          title: '黑豹2：瓦干達萬歲',
          releaseDate: '2022/11/09'
        }
      }
    })
    res.send('delete 黑豹2：瓦干達萬歲 successful')
  } catch (error) {
    res.send(error)
  }
})

app.get('/', async (req, res) => {
  res.send('this is project-cheapskate')
})

const server = app.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:${port}`)
)
