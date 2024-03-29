import { Response } from 'express'

interface ResponseObj {
  success: Boolean
  data: any[]
  error: {}
  message: string
}

export default class responseDTO {
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
