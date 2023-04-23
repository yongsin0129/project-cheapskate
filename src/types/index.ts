export interface MovieData {
  movieTitle: string
  movieUrl: string
  movieReleaseDate: string
}

export interface Log {
  date: string
  message: string | null
  data: any[]
}

export interface ResponseObj {
  success: Boolean
  data: any[]
  error: {}
  message: string
}

export interface tokenPayload {
  id: string
  email: string
}

export interface MyContext {
  token: tokenPayload | null
}
