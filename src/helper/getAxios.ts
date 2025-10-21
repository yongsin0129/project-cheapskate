import axios from 'axios'
import https from 'https'

let instance = axios.create({
  baseURL: 'http://www.atmovies.com.tw/movie',
  timeout: 60000,
  httpsAgent: new https.Agent({ keepAlive: true }),
  headers: { 
    'Content-Type': 'text/html',
    'Accept-Encoding': 'identity',  // 要求服務器返回未壓縮的內容
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
})

export default instance
