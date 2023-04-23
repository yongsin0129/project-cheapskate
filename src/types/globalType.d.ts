interface MovieData {
  movieTitle: string
  movieUrl: string
  movieReleaseDate: string
}

interface Log {
  date: string
  message: string | null
  data: any[]
}

interface ResponseObj {
  success: Boolean
  data: any[]
  error: {}
  message: string
}

interface tokenPayload {
  id: string
  email: string
}

interface MyContext {
  token: tokenPayload | null
}
