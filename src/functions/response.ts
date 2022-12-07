import { Response } from 'express'

export default class response {
  public responseStatusCode: number
  public responseObj: ResponseObj
  constructor (
    public responseData?: {
      responseStatusCode?: number
      success?: Boolean
      data?: any[]
      error?: {} | unknown
      message?: string
    }
  ) {
    this.responseStatusCode = responseData?.responseStatusCode || 500
    this.responseObj = {
      success: responseData?.success || false,
      data: responseData?.data || [],
      error: responseData?.error || {},
      message: responseData?.message || 'There was some internal server error'
    }
  }

  public sendResToClient (res: Response) {
    res.status(this.responseStatusCode).json(this.responseObj)
  }
}
