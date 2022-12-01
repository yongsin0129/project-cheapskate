import express from 'express'
import movieList from './modules/movieList'
import crawler from './modules/crawler'
const router = express.Router()

router.use('/movieList', movieList)

router.use('/crawler', crawler)

router.get('/', async (req, res) => {
  res.send('this is api index')
})

export default router
