import { ErrorRequestHandler, Request, Response, NextFunction } from 'express'

export default function errorHandler (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let responseStatusCode = 500
  let responseObj = {
    success: false,
    data: [],
    error: err,
    message: 'There was some internal server error'
  }

  // IF THERE WAS SOME ERROR THROWN BY PREVIOUS REQUEST
  if (err) {
    // IF THE ERROR IS REALTED TO JWT AUTHENTICATE, SET STATUS CODE TO 401 AND SET A CUSTOM MESSAGE FOR UNAUTHORIZED
    if (err.name === 'JsonWebTokenError') {
      responseStatusCode = 401
      responseObj.message =
        'You cannot get the details. You are not authorized to access this protected resource'
    }
  }

  if (!res.headersSent) {
    res.status(responseStatusCode).json(responseObj)
  }
}
