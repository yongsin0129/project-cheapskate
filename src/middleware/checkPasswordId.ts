import express from 'express'
const router = express.Router()
import Response from '../functions/response'

router.use('/', async (req, res, next) => {
  // 確認 request 的 passwordId
  const { passwordId } = req.body

  if (passwordId !== process.env.passwordId) {
    const errorResponse = new Response({responseStatusCode:400,message:'密碼錯誤，無法呼叫更新 !!!'})
    next(errorResponse)
    return
  } else {
    next()
  }
})

export default router