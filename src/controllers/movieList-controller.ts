import { Request, Response, NextFunction } from 'express'
import * as crawler from '../functions/crawler'
import { Status } from '@prisma/client'

const URL_FirstRound = 'http://www.atmovies.com.tw/movie/now/' // 本期首輪
const URL_SecondRound = 'http://www.atmovies.com.tw/movie/now2/' // 本期二輪

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
export const movieListController = {
  // 更新首輪 ( FirstRound )電影清單
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
    const newUpdateDataLog = await crawler.updateMovieListStatus(
      databaseMovieList,
      onlineMovieList,
      Status.leaveFirstRound
    )

    // returnMessage
    returnMessage.data = []
    returnMessage.data.push(newInputDataLog, newUpdateDataLog)

    res.send(returnMessage)
  },

  // 更新 二輪 ( secondRound ) 的電影清單
  updateSecondRoundMovieList: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    returnMessage.message = '二輪清單更新'

    // 取得 資料庫中離開首輪的電影清單
    const leaveFirstRoundMovieList = await crawler.getDatabaseMovieList(
      Status.leaveFirstRound
    )
    console.log('成功執行資料庫取離開首輪的電影清單')

    // 取得 網站上最新的二輪電影清單
    const onlineMovieList = await crawler.getOnlineMovieList(URL_SecondRound)
    console.log('成功執行網站爬蟲取二輪的電影清單')

    // 比較 離開首輪 資料庫與 網站二輪電影資料 並更新 status 至 SecondFirstRound
    const newUpdateDataInLeaveFirstRound =
      await crawler.updateLeaveRoundToNextStatus(
        leaveFirstRoundMovieList,
        onlineMovieList,
        Status.secondRound
      )

    // 取得 資料庫中二輪的電影清單
    const secondRoundMovieList = await crawler.getDatabaseMovieList(
      Status.secondRound
    )
    console.log('成功執行資料庫取得二輪的電影清單')

    // 將網站上最新的二輪電影清單加入到資料庫
    const newInputDataLog = await crawler.addNewMovieToDatabase(
      onlineMovieList,
      secondRoundMovieList,
      Status.secondRound
    )

    // 比較 資料庫與網站資料 並更新 status 至 leaveSecondRound
    const newUpdateDataLog = await crawler.updateMovieListStatus(
      secondRoundMovieList,
      onlineMovieList,
      Status.leavesecondRound
    )

    // returnMessage
    returnMessage.data = []
    returnMessage.data.push(
      newUpdateDataInLeaveFirstRound,
      newInputDataLog,
      newUpdateDataLog
    )

    res.send(returnMessage)
  }
}
