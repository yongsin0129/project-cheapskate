import { ErrorRequestHandler, Request, Response, NextFunction } from 'express'
import ResponseClass from '../functions/response'

export default function errorHandler (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let responseStatusCode = 500
  let responseObj: ResponseObj = {
    success: false,
    data: [],
    error: err,
    message: 'There was some internal server error'
  }

  // IF THERE WAS SOME ERROR THROWN BY PREVIOUS REQUEST
  if (err) {
    // 有設計並捕抓到的錯誤，會傳入一個 new ResponseClass instance
    if (err instanceof ResponseClass) {
      responseStatusCode =
        err.responseData?.responseStatusCode || responseStatusCode
      responseObj.error = err.responseObj
      responseObj.message = err.responseObj.message
    }

    // IF THE SERROR IS REALTED TO JWT AUTHENTICATE, SET STATUS CODE TO 401 AND SET A CUSTOM MESSAGE FOR UNAUTHORIZED
    else if (err.name === 'JsonWebTokenError') {
      responseStatusCode = 401
      responseObj.message =
        'You cannot get the details. You are not authorized to access this protected resource'
    }

    // 非預期的錯誤
    else {
      responseObj.message = err.toString()
    }
  }

  if (!res.headersSent) {
    res.status(responseStatusCode).json(responseObj)
  }
}
