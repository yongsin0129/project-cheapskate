import express from 'express'
import { Prisma, PrismaClient, Status } from '@prisma/client'
const prisma = new PrismaClient()
const router = express.Router()

router.get('/', async (req, res) => {
  const { searchString, skip, take, orderBy } = req.query

  const or = searchString
    ? {
        OR: [
          { title: { contains: searchString as string } },
          { content: { contains: searchString as string } }
        ]
      }
    : {}

  const movieLists = await prisma.movieList.findMany({
    where: {
      ...or
    },
    take: Number(take) || undefined,
    skip: Number(skip) || undefined
  })

  res.send(movieLists)
})

router.post('/', async (req, res) => {
  const { title, releaseDate, url, status } = req.body

  try {
    const newMovieData = await prisma.movieList.create({
      data: {
        title: title,
        releaseDate: releaseDate,
        url: url,
        status: status
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
    } else {
      res.send(error)
    }
  }
})

router.put('/', async (req, res) => {
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

    res.json(updateMovieData)
  } catch (error) {
    res.send(error)
  }
})

router.delete('/', async (req, res) => {
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

export default router
