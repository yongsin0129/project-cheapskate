import express from 'express'
const router = express.Router()
import { adminController } from '../../controllers/admin-controller'
import checkPasswordId from '../../middleware/checkPasswordId'
/********************************************************************************
*
          router
*
*********************************************************************************/
router.post('/addFirstRoundMovie', checkPasswordId, adminController.addFirstRoundMovie)

router.post('/updateFirstRoundMovieList', checkPasswordId, adminController.updateFirstRoundMovieList)

router.post('/updateLeaveFirstRoundMovie', checkPasswordId, adminController.updateLeaveFirstRoundMovie
)

router.post('/addSecondRoundMovie', checkPasswordId, adminController.addSecondRoundMovie
)

router.post('/updateSecondRoundMovie', checkPasswordId, adminController.updateSecondRoundMovie
)
export default router
