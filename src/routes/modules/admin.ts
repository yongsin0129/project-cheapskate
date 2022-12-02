import express from 'express'
const router = express.Router()
import { movieListController } from '../../controllers/movieList-controller'
import checkPasswordId from '../../middleware/checkPasswordId'
/********************************************************************************
*
          router
*
*********************************************************************************/
router.post('/addFirstRoundMovie', checkPasswordId, movieListController.addFirstRoundMovie)

router.post('/updateFirstRoundMovieList', checkPasswordId, movieListController.updateFirstRoundMovieList)

router.post('/updateLeaveFirstRoundMovie', checkPasswordId, movieListController.updateLeaveFirstRoundMovie
)

router.post('/addSecondRoundMovie', checkPasswordId, movieListController.addSecondRoundMovie
)

router.post('/updateSecondRoundMovie', checkPasswordId, movieListController.updateSecondRoundMovie
)
export default router
