import cheerio from 'cheerio'
import axios from 'axios'
import { Prisma, PrismaClient, Status } from '@prisma/client'

import * as Type from '../types'

const prisma = new PrismaClient()
const host = 'http://www.atmovies.com.tw'

// server log class
class ServerLog implements Type.Log {
  constructor (
    public message: string,
    public date = new Date().toLocaleString('zh-TW', {
      timeZone: 'Asia/taipei'
    }),
    public data: any[] = [],
    public today = new Date()
  ) {
    this.message = message
  }
}

// 取得資料庫中的電影清單 by status
export async function getDatabaseMovieList (status: { status: Status }[]) {
  const movieList = await prisma.movieList.findMany({
    where: {
      OR: [...status]
    }
  })
  await prisma.$disconnect()

  return movieList
}

// 利用爬蟲取得最新的電影清單 by URL , 變換 URL 可取得 首輪 或 二輪 電影清單
export async function getOnlineMovieList (URL: string) {
  const movieList: Type.MovieData[] = []

  try {
    const response = await axios.get(URL)
    const $ = cheerio.load(response.data)

    $('ul.filmListPA li').each((i, el) => {
      const movieTitle = $(el).find('a').text()
      const movieUrl = host + $(el).find('a').attr('href')
      const movieReleaseDate = formatReleaseDate($(el).find('span').text())

      const movieData: Type.MovieData = {
        movieTitle,
        movieUrl,
        movieReleaseDate
      }
      movieList.push(movieData)
    })
  } catch (error) {
    console.log('網站爬蟲出現問題')
    console.log(error)
  }
  await prisma.$disconnect()

  return movieList
}

// 遍歷資料庫中的電影清單(首輪及二輪)比對最新網路清單，並更新到指定狀態 (leave)
// FirstRound or SecondRound change to leaveStatus
export async function updateMovieListStatus (
  databaseMovieList: Prisma.MovieListMaxAggregateOutputType[],
  onlineMovieList: Type.MovieData[],
  statusChange: Status
) {
  // server log init
  const serverLog = new ServerLog(`本次新增至資料庫中的 ${statusChange} 電影`)

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
        continue
      } else {
        // 如果沒有重複，表示此電影已經不在最新網路清單內，需變更狀態
        const needUpdateMovieData = await prisma.movieList.update({
          where: {
            title_releaseDate: {
              title: data.title,
              releaseDate: data.releaseDate
            }
          },
          data: {
            status: statusChange
          }
        })

        // 將有狀態變更的電影資料加入 log 中
        serverLog.data.push({ title_releaseDate, ...needUpdateMovieData })
        console.log(
          `本次資料庫中狀態變更為 ${statusChange} 的電影 : ` + title_releaseDate
        )
      }
    }
  }

  // server side output log
  console.log(serverLog)
  await prisma.$disconnect()

  return serverLog
}

// 將最新的電影首輪 or 二輪清單加入至資料庫中
// add FirstRound or SecondRound
export async function addNewMovieToDatabase (
  onlineMovieList: Type.MovieData[],
  databaseMovieList: Prisma.MovieListMaxAggregateOutputType[],
  statusChange: Status
) {
  // server log init
  const serverLog = new ServerLog(`本次新增至資料庫中的 ${statusChange} 電影`)

  // 製做一個現有資料庫的 string 用來比對
  const databaseMovieList_Title_ReleaseDate = JSON.stringify(
    databaseMovieList.map(MovieData => {
      return MovieData.title! + MovieData.releaseDate!
    })
  )

  // 遍歷 onlineMovieLIst 中的每一個電影，與資料庫做比對
  for (let index = 0; index < onlineMovieList.length; index++) {
    const movieData = onlineMovieList[index]
    const title_releaseDate = movieData.movieTitle + movieData.movieReleaseDate

    // 先檢查最新的首輪 or 二輪電影資料有無存在 database 之中，若有則跳過
    if (
      databaseMovieList_Title_ReleaseDate.includes(title_releaseDate) === true
    ) {
      continue
    }

    // 再檢查這個電影是不是口碑場 ( 上映日期在未來 ) ，若是則跳過
    const givenDate = new Date(movieData.movieReleaseDate)

    if (givenDate > serverLog.today) {
      console.log('口碑場，不加入資料庫中 : ' + title_releaseDate)
      continue
    }

    // 如果沒有重複，將最新的首輪 or 二輪電影資料存入資料庫之中
    try {
      const newMovieData = await prisma.movieList.create({
        data: {
          title: movieData.movieTitle,
          releaseDate: movieData.movieReleaseDate,
          url: movieData.movieUrl,
          status: statusChange
        }
      })

      // 將新增資料寫進 log 中
      serverLog.data.push({ title_releaseDate, ...newMovieData })
      console.log(
        `本次新增至資料庫中的 ${statusChange} 電影 : ` + title_releaseDate
      )
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === 'P2002'
      ) {
        const errorMsg = {
          ...error,
          msg: 'There is a unique constraint violation, a new data cannot be created with this title & releaseDate'
        }
        serverLog.data.push({ title_releaseDate, errorMsg })
      } else {
        serverLog.data.push({ title_releaseDate, error })
      }
    }
  }

  // server side output log
  console.log(serverLog)
  await prisma.$disconnect()

  return serverLog
}

// 遍歷資料庫中已離開首輪(or二輪)的電影清單比對最新網路清單，並更新到指定狀態 (secondRound)
// LeaveFirstRound or LeaveSecondRound change to nextStage
export async function updateLeaveRoundToNextStatus (
  databaseMovieList: Prisma.MovieListMaxAggregateOutputType[],
  onlineMovieList: Type.MovieData[],
  statusChange: Status
) {
  // server log init
  const serverLog = new ServerLog(`本次新增至資料庫中的 ${statusChange} 電影`)

  // 製做一個現有資料庫的 string 用來比對
  const databaseMovieList_Title_ReleaseDate = JSON.stringify(
    databaseMovieList.map(MovieData => {
      return MovieData.title! + MovieData.releaseDate!
    })
  )

  // 遍歷 onlineMovieList 中所有的每一筆資料
  for (let index = 0; index < onlineMovieList.length; index++) {
    const data = onlineMovieList[index]

    const title_releaseDate = data.movieTitle + data.movieReleaseDate

    if (databaseMovieList_Title_ReleaseDate.includes(title_releaseDate)) {
      // 如果重複，表示該電影資料可進入 二輪 or 串流
      const needUpdateMovieData = await prisma.movieList.update({
        where: {
          title_releaseDate: {
            title: data.movieTitle,
            releaseDate: data.movieReleaseDate
          }
        },
        data: {
          status: statusChange
        }
      })

      // 將有狀態變更的電影資料加入 log 中
      serverLog.data.push({ title_releaseDate, ...needUpdateMovieData })
    } else {
      // 如果沒有重複，不作動作
      continue
    }
  }

  // server side output log
  console.log(serverLog)
  await prisma.$disconnect()

  return serverLog
}

// 遍歷資料庫中所有電影清單，並更新至最新狀態 ex: 首輪or二輪
// 僅適用於 DB 有誤的情況
export async function updateAllMovieToFirstOrSecond (
  databaseMovieList: Prisma.MovieListMaxAggregateOutputType[],
  onlineMovieList: Type.MovieData[],
  statusChange: Status
) {
  // server log init
  const serverLog = new ServerLog(`本次新增至資料庫中的 ${statusChange} 電影`)

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
        // 如果重複，需將 DB 資料更新
        // 表示將 DB 資料更新為 首輪 or 二輪
        const needUpdateMovieData = await prisma.movieList.update({
          where: {
            title_releaseDate: {
              title: data.title,
              releaseDate: data.releaseDate
            }
          },
          data: {
            status: statusChange
          }
        })

        // 將有狀態變更的電影資料加入 log 中
        serverLog.data.push({ title_releaseDate, ...needUpdateMovieData })
        console.log(
          `本次資料庫中狀態變更為 ${statusChange} 的電影 : ` + title_releaseDate
        )
      } else {
        continue
      }
    }
  }

  // server side output log
  console.log(serverLog)
  await prisma.$disconnect()

  return serverLog
}

/********************************************************************************
*
          utilities
*
*********************************************************************************/
// 格式化日期字串
function formatReleaseDate (ReleaseDate: string): string {
  // 建立一個 RegExp 格式 XXXX/XX/XX
  const regex = new RegExp(/^[12]\d{3}?\/\d{1,2}?\/\d{1,2}/)
  // 取出符合格式的 string
  let result = ReleaseDate.match(regex)
  if (result !== null) return result[0]
  // 無上映時間的統一處理方式
  else return '1990/01/01'
}
