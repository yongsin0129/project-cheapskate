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
  await addNewMovieToDatabase(onlineMovieList, databaseMovieList)

  // 比較 資料庫與網站資料
  await updateFirstRoundMovieList(databaseMovieList, onlineMovieList)
}

main()

// 由資料庫中的電影清單比對最新網路清單，並進行更新
async function updateFirstRoundMovieList (
  databaseMovieList: Prisma.MovieListMaxAggregateOutputType[],
  onlineMovieList: MovieData[]
) {
  // 製做一個最新網路清單的 string 用來比對
  const onlineMovieList_Title_ReleaseDate = JSON.stringify(
    onlineMovieList.map(MovieData => {
      return MovieData.movieTitle + MovieData.movieReleaseDate
    })
  )

  // 遍歷資料庫中所有的每一筆資料
  for (let index = 0; index < databaseMovieList.length; index++) {
    const data = databaseMovieList[index]
    if (data.title !== null && data.releaseDate !== null) {
      const title_releaseDate = data.title + data.releaseDate

      if (onlineMovieList_Title_ReleaseDate.includes(title_releaseDate)) {
        // 如果重複，不進行任何動作
      } else {
        // 如果沒有重複，表示此電影已經不在首輪內
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
        console.log('----------本次狀態更改的電影----------')
        console.log(needUpdateMovieData)
      }
    }
  }
}

// 取得資料庫中的電影清單 by status
async function getDatabaseMovieList (status: Status) {
  const movieList = await prisma.movieList.findMany({
    where: { status }
  })
  return movieList
}

// 利用爬蟲取得重新的電影清單 by URL
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

// 格式化日期字串
function formatReleaseDate (ReleaseDate: string): string {
  const regex = new RegExp(/^[12]\d{3}?\/\d{1,2}?\/\d{1,2}?/)
  let result = ReleaseDate.match(regex)
  if (result !== null) return result[0]
  else return '1990/01/01' // 無上映時間的統一處理方式
}

// 將最新的首輪清單加入至資料庫中
async function addNewMovieToDatabase (
  onlineMovieList: MovieData[],
  databaseMovieList: Prisma.MovieListMaxAggregateOutputType[]
) {
  // 製做一個現有資料庫的 string 用來比對
  const databaseMovieList_Title_ReleaseDate = JSON.stringify(
    databaseMovieList.map(MovieData => {
      return MovieData.title! + MovieData.releaseDate!
    })
  )

  for (let index = 0; index < onlineMovieList.length; index++) {
    const movieData = onlineMovieList[index]
    const title_releaseDate = movieData.movieTitle + movieData.movieReleaseDate
    
    // 先檢查最新的首輪電影資料有無存在 database 之中，若有則跳過
    if (
      databaseMovieList_Title_ReleaseDate.includes(title_releaseDate) === true
    ) {
      continue
    }

    // 將最新的首輪電影資料存入資料庫之中
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
      } else {
        console.log(error)
      }
    }
  }
}
