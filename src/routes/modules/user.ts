import express from 'express'
const router = express.Router()
import passport from 'passport'
import { userController } from '../../controllers/user-controller'
import { jwtAuthenticate } from '../../middleware/auth'

/********************************************************************************
*
          router
*
*********************************************************************************/
router.post(
  '/signUp',

  /*  

  #swagger.summary = '使用者註冊新帳號'
  #swagger.responses[200] = {
            description: 'register successfully',
            schema: { $ref: '#/definitions/response200'}
          }
  #swagger.responses[400] = {
            description: 'bad request',
            schema: { $ref: '#/definitions/response400' }
          }

  */

  userController.register
)

router.post('/signIn',

  /*  
  #swagger.summary = '使用者登入並取得 jwt token'
  #swagger.responses[200] = {
            description: 'logIn successfully',
            schema: {   
                      "success": true,
                      "data": [{ user: {} , jwtToken: {} }],
                      "error": {},
                      "message": "some message"
                    }
          }
  #swagger.responses[400] = {
            description: 'bad request',
            schema: { $ref: '#/definitions/response400' }
          }

  */

userController.signIn)

router.get('/test',

  /*  
  #swagger.summary = '測試 jwt token 專用的路由'
  */

jwtAuthenticate, userController.test)

export default router
