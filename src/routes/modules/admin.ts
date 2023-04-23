import express from 'express'

import { adminController } from '../../controllers/admin-controller'
import checkPasswordId from '../../middleware/checkPasswordId'

const router = express.Router()

/********************************************************************************
*
          router
*
*********************************************************************************/
router.post(
  '/addFirstRoundMovie',

  /*  
  #swagger.summary = '使用爬蟲比對，並新增首輪 ( FirstRound ) 電影清單至資料庫中'
  #swagger.parameters['passwordId'] = {
                in: 'body',
                description: '每次呼叫爬蟲更新都需要密碼',
                required: true,
                schema: {"passwordId": "string"}
                }
  #swagger.responses[200] = {
            description: 'update successfully',
            schema: { $ref: '#/definitions/updateMovieListResponse'}
          }
  #swagger.responses[400] = {
            description: 'bad request',
            schema: { $ref: '#/definitions/response400' }
          }

  */

  checkPasswordId,
  adminController.addFirstRoundMovie
)

router.post(
  '/updateFirstRoundMovieList',

  /*  
  #swagger.summary = '使用爬蟲比對，並將首輪下架電影更改狀態至 leaveFirstRound'
  #swagger.parameters['passwordId'] = {
                in: 'body',
                description: '每次呼叫爬蟲更新都需要密碼',
                required: true,
                schema: {"passwordId": "string"}
                }
  #swagger.responses[200] = {
            description: 'update successfully',
            schema: { $ref: '#/definitions/updateMovieListResponse'}
          }
  #swagger.responses[400] = {
            description: 'bad request',
            schema: { $ref: '#/definitions/response400' }
          }

  */

  checkPasswordId,
  adminController.updateFirstRoundMovieList
)

router.post(
  '/updateLeaveFirstRoundMovie',

  /*  
  #swagger.summary = '使用爬蟲比對，並將狀態為 leaveFirstRound 的電影清單更新至二輪電影 (secondRound)'
  #swagger.parameters['passwordId'] = {
                in: 'body',
                description: '每次呼叫爬蟲更新都需要密碼',
                required: true,
                schema: {"passwordId": "string"}
                }
  #swagger.responses[200] = {
            description: 'update successfully',
            schema: { $ref: '#/definitions/updateMovieListResponse'}
          }
  #swagger.responses[400] = {
            description: 'bad request',
            schema: { $ref: '#/definitions/response400' }
          }

  */

  checkPasswordId,
  adminController.updateLeaveFirstRoundMovie
)

router.post(
  '/addSecondRoundMovie',

  /*  
  #swagger.summary = '使用爬蟲比對，並新增二輪 ( secondRound ) 電影清單至資料庫中'
  #swagger.parameters['passwordId'] = {
                in: 'body',
                description: '每次呼叫爬蟲更新都需要密碼',
                required: true,
                schema: {"passwordId": "string"}
                }
  #swagger.responses[200] = {
            description: 'update successfully',
            schema: { $ref: '#/definitions/updateMovieListResponse'}
          }
  #swagger.responses[400] = {
            description: 'bad request',
            schema: { $ref: '#/definitions/response400' }
          }

  */

  checkPasswordId,
  adminController.addSecondRoundMovie
)

router.post(
  '/updateSecondRoundMovie',

  /*  
  #swagger.summary = '使用爬蟲比對，並將二輪下架電影更改狀態至 leaveSecondRound'
  #swagger.parameters['passwordId'] = {
                in: 'body',
                description: '每次呼叫爬蟲更新都需要密碼',
                required: true,
                schema: {"passwordId": "string"}
                }
  #swagger.responses[200] = {
            description: 'update successfully',
            schema: { $ref: '#/definitions/updateMovieListResponse'}
          }
  #swagger.responses[400] = {
            description: 'bad request',
            schema: { $ref: '#/definitions/response400' }
          }

  */

  checkPasswordId,
  adminController.updateSecondRoundMovie
)
export default router
