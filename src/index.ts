import express from 'express'
import passport from 'passport'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import http from 'http'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'

import api from './routes'
import { typeDefs } from './schemas'
import { resolvers } from './resolvers'
import { decrypt_JWT_Token } from './helper/validation'
import swaggerFile from '../swagger_output.json'
import { passportInit } from './config/passport'
import { ApolloServerLandingPageConfig } from './config/ApolloServerLandingPageConfig'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const PORT = process.env.PORT || 3000

const booStrap = async () => {
  // Creates an Express application.
  const app = express()

  // Creates an ApolloServer.
  const httpServer = http.createServer(app)
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerLandingPageConfig
    ]
  })
  await server.start()

  // passport initialize
  passportInit(passport)

  // express config
  app.use(cors({ origin: '*' }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // route for RESTful API
  app.use('/api', api)

  // route for GraphQL landing page
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        token: decrypt_JWT_Token(req.headers.jwt_token as string)
      })
    })
  )
  
  // route for swagger doc
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerFile))
  
  // HTTP server starts listening on a specified port.
  await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve))

  console.log(`🚀 Server ready at http://localhost:${PORT}/ version:1.0.0.0`)
}

booStrap()
