import axios from 'axios'
import https from 'https'

let instance = axios.create({
  baseURL: 'http://www.atmovies.com.tw/movie',
  timeout: 60000, //optional
  httpsAgent: new https.Agent({ keepAlive: true }),
  headers: { 'Content-Type': 'text/html' }
})

export default instance
