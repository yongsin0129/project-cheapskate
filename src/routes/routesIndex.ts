import express from 'express'
import movieList from './modules/movieList'
const router = express.Router()

router.use('/movieList', movieList)

router.get('/', async (req, res) => {
  res.send('this is api index')
})

export default router