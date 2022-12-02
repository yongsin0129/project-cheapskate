import { Request, Response, NextFunction } from 'express'
import * as crawler from '../functions/crawler'
import { Status } from '@prisma/client'

const URL_FirstRound = 'http://www.atmovies.com.tw/movie/now/' // 本期首輪
const URL_SecondRound = 'http://www.atmovies.com.tw/movie/now2/' // 本期二輪

// server side 記錄本次程式執行的時間
console.log(new Date().toLocaleString('zh-TW', { timeZone: 'Asia/taipei' }))

// return log initial
const returnMessage: Log = {
  date: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/taipei' }),
  message: '',
  data: []
}

/********************************************************************************
*
          controllers
*
*********************************************************************************/
export const movieList = {
  updateFirstRoundMovieList: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    returnMessage.message = '首輪清單更新'

    // 取得 資料庫中首輪的電影清單
    const databaseMovieList = await crawler.getDatabaseMovieList(
      Status.firstRound
    )
    console.log('成功執行資料庫取首輪的電影清單')

    // 取得 網站上最新的首輪電影清單
    const onlineMovieList = await crawler.getOnlineMovieList(URL_FirstRound)
    console.log('成功執行網站爬蟲取首輪的電影清單')

    // 將網站上最新的首輪電影清單加入到資料庫
    const newInputDataLog = await crawler.addNewMovieToDatabase(
      onlineMovieList,
      databaseMovieList,
      Status.firstRound
    )

    // 比較 資料庫與網站資料 並更新 status 至 leaveFirstRound 
    const newUpdateDataLog = await crawler.updateFirstRoundMovieList(
      databaseMovieList,
      onlineMovieList,
      Status.leaveFirstRound
    )

    // returnMessage
    returnMessage.data = []
    returnMessage.data.push(newInputDataLog, newUpdateDataLog)

    res.send(returnMessage)
  }
}
