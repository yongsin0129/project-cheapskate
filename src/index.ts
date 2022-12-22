console.log('server env.NODE_ENV : ' + process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
import express from 'express'
import api from './routes/routesIndex'
import passport from 'passport'
import { passportInit } from './config/passport'
import cors from 'cors'
import { ApolloServer } from '@apollo/server'
import gql from 'graphql-tag'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import http from 'http'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from '../swagger_output.json'
import { typeDefs } from './schemas'
import { resolvers } from './resolvers'
import { makeExecutableSchema } from '@graphql-tools/schema'
const schema = makeExecutableSchema({ typeDefs, resolvers })

const PORT = process.env.PORT || 3000

interface MyContext {
  token?: String
}

const booStrap = async () => {
  passportInit(passport)
  const port = process.env.PORT
  const app = express()
  const httpServer = http.createServer(app)
  const server = new ApolloServer<MyContext>({
    // schema,
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  })
  await server.start()

  app.use(cors({ origin: '*' }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // RESTful API
  app.use('/api', api)
  // GraphQL
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    // bodyParser.json(), // 這行不需要，因為上面已經有 app.use(express.json())
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token })
    })
  )
  // swagger doc
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerFile))

  await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve))
  console.log(`🚀 Server ready at http://localhost:${PORT}/`)
}

booStrap()
