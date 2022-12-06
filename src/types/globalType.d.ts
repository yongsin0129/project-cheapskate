interface MovieData {
  movieTitle: string
  movieUrl: string
  movieReleaseDate: string
}

interface Log {
  date: string
  message: string
  data: any[]
}

interface ResponseObj {
  success: Boolean
  data: any[]
  error: {}
  message: string
}
