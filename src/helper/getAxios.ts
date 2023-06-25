import axios from 'axios'
import https from 'https'

let instance = axios.create({
  timeout: 60000, //optional
  httpsAgent: new https.Agent({ keepAlive: true }),
  headers: { 'Content-Type': 'application/xml' }
})

export default instance
