import express from 'express'
import movieList from './modules/movieList'
import admin from './modules/admin'
import user from './modules/user'
import errorHandler from '../controllers/errorHandler'

const router = express.Router()

router.use(
  '/movieList',
  /*  
#swagger.tags = ['movieList']
#swagger.deprecated = true
  */

  movieList
)

router.use(
  '/admin',
  // #swagger.tags = ['admin']
  admin
)

router.use(
  '/user',
  // #swagger.tags = ['user']
  user
)

router.use(errorHandler)

export default router
