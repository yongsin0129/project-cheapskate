import express from 'express'
import movieList from './modules/movieList'
import admin from './modules/admin'
import user from './modules/user'
import errorHandler from '../controllers/errorHandler'

const router = express.Router()

router.use('/movieList', movieList)

router.use('/admin', admin)

router.use('/user', user)

router.get('/', async (req, res) => {
  res.send('this is api index')
})

router.use(errorHandler)

export default router
