import express from 'express'

import ResponseDTO from '../dto/responseDTO'

const router = express.Router()

router.use('/', async (req, res, next) => {
  // 確認 request 的 passwordId
  const { passwordId } = req.body

  if (passwordId !== process.env.passwordId) {
    const errorResponse = new ResponseDTO({responseStatusCode:400,message:'密碼錯誤，無法呼叫更新 !!!'})
    next(errorResponse)
    return
  } else {
    next()
  }
})

export default router