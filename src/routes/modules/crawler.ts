import cheerio from 'cheerio'
import axios from 'axios'
import express from 'express'
import { Prisma, PrismaClient, Status } from '@prisma/client'
const prisma = new PrismaClient()
const router = express.Router()

const host = 'http://www.atmovies.com.tw'
const URL_FirstRound = 'http://www.atmovies.com.tw/movie/now/' // 本期首輪
const URL_SecondRound = 'http://www.atmovies.com.tw/movie/now2/' // 本期二輪

interface MovieData {
  movieTitle: string
  movieUrl: string
  movieReleaseDate: string
}

async function main () {
  // 取得 資料庫中首輪的電影清單
  const databaseMovieList = await getDatabaseMovieList(Status.firstRound)

  // 取得 網站上最新的首輪電影清單
  const onlineMovieList = await getOnlineMovieList(URL_FirstRound)

  // 將網站上最新的首輪電影清單加入到資料庫
  for (let index = 0; index < onlineMovieList.length; index++) {
    await updateDatabase(onlineMovieList[index])
  }

  // 比較 資料庫與網站資料
  await updateFirstRoundMovieList(databaseMovieList, onlineMovieList)
}

main()

async function updateFirstRoundMovieList (
  databaseMovieList: Prisma.MovieListMaxAggregateOutputType[],
  onlineMovieList: MovieData[]
) {
  const onlineMovieList_Title_ReleaseDate = JSON.stringify(
    onlineMovieList.map(MovieData => {
      return MovieData.movieTitle + MovieData.movieReleaseDate
    })
  )

  // console.log(onlineMovieList_Title_ReleaseDate)

  for (let index = 0; index < databaseMovieList.length; index++) {
    const data = databaseMovieList[index]
    if (data.title !== null && data.releaseDate !== null) {
      const title_releaseDate = data.title + data.releaseDate

      if (onlineMovieList_Title_ReleaseDate.includes(title_releaseDate)) {
        // console.log('重複的 : ' + title_releaseDate)
      } else {
        // console.log('沒有重複的 : ' + title_releaseDate)
        const needUpdateMovieData = await prisma.movieList.update({
          where: {
            title_releaseDate: {
              title: data.title,
              releaseDate: data.releaseDate
            }
          },
          data: {
            status: Status.leaveFirstRound
          }
        })
        console.log('----------本次狀態變換的電影----------')
        console.log('needUpdateMovieData', needUpdateMovieData)
      }
    }
  }
}

async function getDatabaseMovieList (status: Status) {
  const movieList = await prisma.movieList.findMany({
    where: { status }
  })
  return movieList
}

async function getOnlineMovieList (URL: string) {
  const movieList: MovieData[] = []

  const response = await axios.get(URL)
  const $ = cheerio.load(response.data)

  $('ul.filmListPA li').each((i, el) => {
    const movieTitle = $(el).find('a').text()
    const movieUrl = host + $(el).find('a').attr('href')
    const movieReleaseDate = formatReleaseDate($(el).find('span').text())

    const movieData: MovieData = { movieTitle, movieUrl, movieReleaseDate }
    movieList.push(movieData)
  })

  return movieList
}

function formatReleaseDate (ReleaseDate: string): string {
  const regex = new RegExp(/^[12]\d{3}?\/\d{1,2}?\/\d{1,2}?/)
  let result = ReleaseDate.match(regex)
  if (result !== null) return result[0]
  else return '1990/01/01' // 無上映時間的統一處理方式
}

async function updateDatabase (movieData: MovieData) {
  try {
    const newMovieData = await prisma.movieList.create({
      data: {
        title: movieData.movieTitle,
        releaseDate: movieData.movieReleaseDate,
        url: movieData.movieUrl,
        status: Status.firstRound
      }
    })
    console.log('----------本次更新添加的電影----------')
    console.log(newMovieData)
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error?.code === 'P2002'
    ) {
      const errorMsg = {
        ...error,
        msg: 'There is a unique constraint violation, a new data cannot be created with this title & releaseDate'
      }
      // console.log(errorMsg)
    } else {
      // console.log(error)
    }
  }
}
