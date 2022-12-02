import express from 'express'
const router = express.Router()
import { movieListController } from '../../controllers/movieList-controller'
import checkPasswordId from '../../middleware/checkPasswordId'
/********************************************************************************
*
          router
*
*********************************************************************************/
router.post('/updateFirstRoundMovieList', checkPasswordId, movieListController.updateFirstRoundMovieList)

router.post('/updateSecondRoundMovieList', checkPasswordId, movieListController.updateSecondRoundMovieList)

export default router
