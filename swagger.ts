const swaggerAutogen = require('swagger-autogen')() // 可用 require('swagger-autogen')(options)

// const options = {
//     openapi: <string>,          // Enable/Disable OpenAPI. By default is null
//     language: <string>,         // Change response language. By default is 'en-US'
//     disableLogs: <boolean>,     // Enable/Disable logs. By default is false
//     autoHeaders: <boolean>,     // Enable/Disable automatic headers capture. By default is true
//     autoQuery: <boolean>,       // Enable/Disable automatic query capture. By default is true
//     autoBody: <boolean>         // Enable/Disable automatic body capture. By default is true
// }

const doc = {
  info: {
    version: '1.0.0', // by default: "1.0.0"
    title: '小氣鬼的電影追蹤工具', // by default: "REST API"
    description: '一个"小氣鬼"心目中的娛樂省錢方案！' // by default: ""
  },
  host: 'https://project-cheapskate-yongsin0129.vercel.app', // by default: "localhost:3000"
  basePath: '', // by default: "/"
  schemes: [], // by default: ['http']
  consumes: [], // by default: ['application/json']
  produces: [], // by default: ['application/json']
  tags: [
    // by default: empty Array
    {
      name: 'admin', // Tag name
      description: '管理者使用的各種路由，包括 : [ 更新電影清單資料庫... ] ' // Tag description
    },
    {
      name: 'user', // Tag name
      description: '使用者登入驗證的路由' // Tag description
    },
    {
      name: 'movieList', // Tag name
      description: '電影清單的路由' // Tag description
    }
    // { ... }
  ],
  securityDefinitions: {}, // by default: empty object
  definitions: {},
  components: {}
}

const outputFile = './swagger_output.json' // 輸出的文件名稱
const endpointsFiles = ['./src/index.ts'] // 要指向的 API，通常使用 Express 直接指向到 app.js 就可以
// const endpointsFiles = ['./routes/index.js', './routes/users.js'] // 也可以指定 routes

swaggerAutogen(outputFile, endpointsFiles, doc) // swaggerAutogen 的方法
