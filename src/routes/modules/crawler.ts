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

interface Log {
  date: string
  message: string
  data: any[]
}

/********************************************************************************
*
          router
*
*********************************************************************************/
router.post('/', async (req, res, next) => {
  // 確認 request 的 passwordId
  const { passwordId } = req.body
  if (passwordId !== process.env.passwordId) {
    res.send('密碼錯誤，無法呼叫更新')
    return
  }

  // log init
  const returnMessage: Log = {
    date: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/taipei' }),
    message: '執行首輪電影清單新增與狀態更新',
    data: []
  }

  // main function
  // 記錄本次程式執行的時間
  console.log(new Date().toLocaleString('zh-TW', { timeZone: 'Asia/taipei' }))

  // 取得 資料庫中首輪的電影清單
  const databaseMovieList = await getDatabaseMovieList(Status.firstRound)
  console.log('成功執行資料庫取資料')

  // 取得 網站上最新的首輪電影清單
  const onlineMovieList = await getOnlineMovieList(URL_FirstRound)
  console.log('成功執行網站爬蟲取資料')

  // 將網站上最新的首輪電影清單加入到資料庫
  const newInputDataLog = await addNewMovieToDatabase(
    onlineMovieList,
    databaseMovieList
  )

  // 比較 資料庫與網站資料 並 更新 status
  const newUpdateDataLog = await updateFirstRoundMovieList(
    databaseMovieList,
    onlineMovieList
  )

  // returnMessage
  returnMessage.data.push(newInputDataLog, newUpdateDataLog)
  res.send(returnMessage)
})

export default router

/********************************************************************************
*
          functions
*
*********************************************************************************/

// 由資料庫中的電影清單比對最新網路清單，並進行更新
async function updateFirstRoundMovieList (
  databaseMovieList: Prisma.MovieListMaxAggregateOutputType[],
  onlineMovieList: MovieData[]
) {
  // log init
  const log: Log = {
    date: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/taipei' }),
    message: '本次資料庫中有狀態變更的電影',
    data: []
  }

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

        log.data.push({ title_releaseDate, ...needUpdateMovieData })
      }
    }
  }

  // 輸出 log
  console.log(log)
  return log
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

  try {
    const response = await axios.get(URL)
    const $ = cheerio.load(response.data)

    $('ul.filmListPA li').each((i, el) => {
      const movieTitle = $(el).find('a').text()
      const movieUrl = host + $(el).find('a').attr('href')
      const movieReleaseDate = formatReleaseDate($(el).find('span').text())

      const movieData: MovieData = { movieTitle, movieUrl, movieReleaseDate }
      movieList.push(movieData)
    })
  } catch (error) {
    console.log('網站爬蟲出現問題')
    console.log(error)
  }

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
  // log init
  const log: Log = {
    date: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/taipei' }),
    message: '本次新增至資料庫中的首輪電影',
    data: []
  }

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
      // 將新增資料寫進 log 中
      log.data?.push({ title_releaseDate, ...newMovieData })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === 'P2002'
      ) {
        const errorMsg = {
          ...error,
          msg: 'There is a unique constraint violation, a new data cannot be created with this title & releaseDate'
        }
        log.data?.push({ title_releaseDate, errorMsg })
      } else {
        log.data?.push({ title_releaseDate, error })
      }
    }
  }

  // 輸出 log
  console.log(log)
  return log
}
