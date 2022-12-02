import express from 'express'
const router = express.Router()
import { movieList } from '../../controllers/movieList'
import checkPasswordId from '../../middleware/checkPasswordId'
/********************************************************************************
*
          router
*
*********************************************************************************/
router.post('/', checkPasswordId, movieList.updateFirstRoundMovieList)

export default router
