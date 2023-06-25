import { Request, Response, NextFunction } from 'express'
import { Status } from '@prisma/client'

import * as crawler from '../helper/crawler'
import * as Type from '../types'

const URL_FirstRound = 'http://www.atmovies.com.tw/movie/now/' // 本期首輪
const URL_SecondRound = 'http://www.atmovies.com.tw/movie/now2/' // 本期二輪

// returnMessage class
class ReturnMessage implements Type.Log {
  constructor (
    public message: string,
    public date = new Date().toLocaleString('zh-TW', {
      timeZone: 'Asia/taipei'
    }),
    public data: any[] = []
  ) {
    this.message = message
  }
}

export const adminController = {
  // 新增首輪 ( FirstRound )電影清單
  addFirstRoundMovie: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log('addFirstRoundMovie')
    const returnMessage = new ReturnMessage('新增首輪清單')

    try {
      // 取得 資料庫中 所有的 電影清單
      const databaseMovieList = await crawler.getDatabaseMovieList([
        { status: Status.firstRound },
        { status: Status.leaveFirstRound },
        { status: Status.secondRound },
        { status: Status.leaveSecondRound },
        { status: Status.Streaming }
      ])
      if (databaseMovieList.success === false)
        throw new Error(databaseMovieList.message)

      console.log('成功執行資料庫取首輪的電影清單')

      // 取得 網站上最新的首輪電影清單
      const onlineMovieList = await crawler.getOnlineMovieList(URL_FirstRound)
      if (onlineMovieList.success === false)
        throw new Error(onlineMovieList.message)

      console.log('成功執行網站爬蟲取首輪的電影清單')

      // 將網站上最新的首輪電影清單加入到資料庫
      const newInputDataLog = await crawler.addNewMovieToDatabase(
        onlineMovieList.data,
        databaseMovieList.data,
        Status.firstRound
      )
      console.log('成功更新資料庫')

      // returnMessage
      returnMessage.data.push(newInputDataLog)
    } catch (error) {
      returnMessage.data.push((error as Error).message)
    }

    res.send(returnMessage)
  },

  // 更新首輪 ( FirstRound )電影清單
  updateFirstRoundMovieList: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log('updateFirstRoundMovieList')
    const returnMessage = new ReturnMessage('資料庫中首輪清單更新')

    try {
      // 取得 資料庫中首輪的電影清單
      const databaseMovieList = await crawler.getDatabaseMovieList([
        { status: Status.firstRound }
      ])
      if (databaseMovieList.success === false)
        throw new Error(databaseMovieList.message)

      console.log('成功執行資料庫取首輪的電影清單')

      // 取得 網站上最新的首輪電影清單
      const onlineMovieList = await crawler.getOnlineMovieList(URL_FirstRound)
      if (onlineMovieList.success === false)
        throw new Error(onlineMovieList.message)

      console.log('成功執行網站爬蟲取首輪的電影清單')

      // 比較 資料庫與網站資料 並更新 status 至 leaveFirstRound
      const newUpdateDataLog = await crawler.updateMovieListStatus(
        databaseMovieList.data,
        onlineMovieList.data,
        Status.leaveFirstRound
      )

      // returnMessage
      returnMessage.data.push(newUpdateDataLog)
    } catch (error) {
      returnMessage.data.push((error as Error).message)
    }

    res.send(returnMessage)
  },

  // 更新 離開首輪 ( leaveFirstRound ) 的電影清單
  updateLeaveFirstRoundMovie: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log('updateLeaveFirstRoundMovie')
    const returnMessage = new ReturnMessage('離開首輪清單 更新')

    try {
      // 取得 資料庫中離開首輪的電影清單
      const leaveFirstRoundMovieList = await crawler.getDatabaseMovieList([
        { status: Status.leaveFirstRound }
      ])

      if (leaveFirstRoundMovieList.success === false)
        throw new Error(leaveFirstRoundMovieList.message)

      console.log('成功執行資料庫取離開首輪的電影清單')

      // 取得 網站上最新的二輪電影清單
      const onlineMovieList = await crawler.getOnlineMovieList(URL_SecondRound)

      if (onlineMovieList.success === false)
        throw new Error(onlineMovieList.message)

      console.log('成功執行網站爬蟲取二輪的電影清單')

      // 比較 離開首輪 資料庫與 網站二輪電影資料 並更新 status 至 SecondFirstRound
      const newUpdateDataInLeaveFirstRound =
        await crawler.updateLeaveRoundToNextStatus(
          leaveFirstRoundMovieList.data,
          onlineMovieList.data,
          Status.secondRound
        )

      // returnMessage
      returnMessage.data.push(newUpdateDataInLeaveFirstRound)
    } catch (error) {
      returnMessage.data.push((error as Error).message)
    }

    res.send(returnMessage)
  },

  // 新增 二輪 ( secondRound ) 的電影清單
  addSecondRoundMovie: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log('addSecondRoundMovie')
    const returnMessage = new ReturnMessage('新增二輪清單')

    try {
      // 取得 網站上最新的二輪電影清單
      const onlineMovieList = await crawler.getOnlineMovieList(URL_SecondRound)
      if (onlineMovieList.success === false)
        throw new Error(onlineMovieList.message)

      console.log('成功執行網站爬蟲取二輪的電影清單')

      // 取得 資料庫中二輪的電影清單
      const secondRoundMovieList = await crawler.getDatabaseMovieList([
        { status: Status.secondRound },
        { status: Status.leaveSecondRound },
        { status: Status.Streaming }
      ])

      if (secondRoundMovieList.success === false)
        throw new Error(secondRoundMovieList.message)

      console.log('成功執行資料庫取得二輪的電影清單')

      // 將網站上最新的二輪電影清單加入到資料庫
      const newInputDataLog = await crawler.addNewMovieToDatabase(
        onlineMovieList.data,
        secondRoundMovieList.data,
        Status.secondRound
      )

      // returnMessage
      returnMessage.data.push(newInputDataLog)
    } catch (error) {
      returnMessage.data.push((error as Error).message)
    }

    res.send(returnMessage)
  },

  // 更新 二輪 ( secondRound ) 的電影清單
  updateSecondRoundMovie: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log('updateSecondRoundMovie')
    const returnMessage = new ReturnMessage('二輪清單 更新')

    try {
      // 取得 網站上最新的二輪電影清單
      const onlineMovieList = await crawler.getOnlineMovieList(URL_SecondRound)
      if (onlineMovieList.success === false)
        throw new Error(onlineMovieList.message)

      console.log('成功執行網站爬蟲取二輪的電影清單')

      // 取得 資料庫中二輪的電影清單
      const secondRoundMovieList = await crawler.getDatabaseMovieList([
        { status: Status.secondRound }
      ])
      if (secondRoundMovieList.success === false)
        throw new Error(secondRoundMovieList.message)

      console.log('成功執行資料庫取得二輪的電影清單')

      // 比較 資料庫與網站資料 並更新 status 至 leaveSecondRound
      const newUpdateDataLog = await crawler.updateMovieListStatus(
        secondRoundMovieList.data,
        onlineMovieList.data,
        Status.leaveSecondRound
      )

      // returnMessage
      returnMessage.data.push(newUpdateDataLog)
    } catch (error) {
      returnMessage.data.push((error as Error).message)
    }

    res.send(returnMessage)
  },

  // 將資料庫中所有電影取出來比對，將舊資料更新為首輪
  updateDB: async (req: Request, res: Response, next: NextFunction) => {
    console.log('updateDB for first round')
    const returnMessage = new ReturnMessage(
      '將資料庫中所有電影取出來比對，將舊資料更新為首輪'
    )

    try {
      // 取得 資料庫中 所有電影清單，首輪、二輪除外
      const databaseMovieList = await crawler.getDatabaseMovieList([
        { status: Status.leaveFirstRound },
        { status: Status.leaveSecondRound },
        { status: Status.Streaming }
      ])

      if (databaseMovieList.success === false)
        throw new Error(databaseMovieList.message)

      console.log('成功執行資料庫的電影清單 - 所有電影清單，首輪、二輪除外')

      // 取得 網站上最新的首輪電影清單
      const onlineMovieList_FirstRound = await crawler.getOnlineMovieList(
        URL_FirstRound
      )
      if (onlineMovieList_FirstRound.success === false)
        throw new Error(onlineMovieList_FirstRound.message)

      console.log('成功執行網站爬蟲取 "首輪" 的電影清單')

      // 將資料庫中所有電影取出來比對，將錯誤資料更新為首輪 or 二輪
      const newInputDataLog_FirstRound =
        await crawler.updateAllMovieToFirstOrSecond(
          databaseMovieList.data,
          onlineMovieList_FirstRound.data,
          Status.firstRound
        )

      // 取得 網站上最新的二輪電影清單
      const onlineMovieList_SecondRound = await crawler.getOnlineMovieList(
        URL_SecondRound
      )
      if (onlineMovieList_SecondRound.success === false)
        throw new Error(onlineMovieList_SecondRound.message)

      console.log('成功執行網站爬蟲取 "二輪" 的電影清單')

      // 將資料庫中所有電影取出來比對，將錯誤資料更新為首輪 or 二輪
      const newInputDataLog_SecondRound =
        await crawler.updateAllMovieToFirstOrSecond(
          databaseMovieList.data,
          onlineMovieList_SecondRound.data,
          Status.secondRound
        )

      // returnMessage
      returnMessage.data.push(newInputDataLog_FirstRound)
      returnMessage.data.push(newInputDataLog_SecondRound)
    } catch (error) {
      returnMessage.data.push((error as Error).message)
    }

    res.send(returnMessage)
  }
}
