import express from 'express'
const router = express.Router()

router.use('/', async (req, res, next) => {
  // 確認 request 的 passwordId
  const { passwordId } = req.body

  if (passwordId !== process.env.passwordId) {
    res.send('密碼錯誤，無法呼叫更新')
    return
  } else {
    next()
  }
})

export default router