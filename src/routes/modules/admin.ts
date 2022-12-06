import express from 'express'
const router = express.Router()
import { adminController } from '../../controllers/admin-controller'
import checkPasswordId from '../../middleware/checkPasswordId'
/********************************************************************************
*
          router
*
*********************************************************************************/
router.post(
  '/addFirstRoundMovie',
  // #swagger.summary = '使用爬蟲比對，並新增首輪 ( FirstRound ) 電影清單至資料庫中'
  checkPasswordId,
  adminController.addFirstRoundMovie
)

router.post(
  '/updateFirstRoundMovieList',
  // #swagger.summary = '使用爬蟲比對，並將首輪下架電影更改狀態至 leaveFirstRound'
  checkPasswordId,
  adminController.updateFirstRoundMovieList
)

router.post(
  '/updateLeaveFirstRoundMovie',
  // #swagger.summary = '使用爬蟲比對，並將狀態為 leaveFirstRound 的電影清單更新至二輪電影 (secondRound)'
  checkPasswordId,
  adminController.updateLeaveFirstRoundMovie
)

router.post(
  '/addSecondRoundMovie',
  // #swagger.summary = '使用爬蟲比對，並新增二輪 ( secondRound ) 電影清單至資料庫中'
  checkPasswordId,
  adminController.addSecondRoundMovie
)

router.post(
  '/updateSecondRoundMovie',
  // #swagger.summary = '使用爬蟲比對，並將二輪下架電影更改狀態至 leaveSecondRound'
  checkPasswordId,
  adminController.updateSecondRoundMovie
)
export default router
