import express from 'express'
import movieList from './modules/movieList'
import admin from './modules/admin'
const router = express.Router()

router.use('/movieList', movieList)

router.use('/admin', admin)

router.get('/', async (req, res) => {
  res.send('this is api index')
})

export default router
