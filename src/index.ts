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
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import http from 'http'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from '../swagger_output.json'
import { typeDefs } from './schemas'
import { resolvers } from './resolvers'
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault
} from '@apollo/server/plugin/landingPage/default'
import { decrypt_JWT_Token } from './functions/validation'

const PORT = process.env.PORT || 3000
// Install a landing page plugin based on NODE_ENV
const ApolloServerLandingPageConfig =
  process.env.NODE_ENV === 'production'
    ? ApolloServerPluginLandingPageProductionDefault({
        graphRef: process.env.APOLLO_GRAPH_REF,
        footer: false
      })
    : ApolloServerPluginLandingPageLocalDefault({ footer: false })

const booStrap = async () => {
  passportInit(passport)
  const app = express()
  const httpServer = http.createServer(app)
  const server = new ApolloServer<MyContext>({
    // schema,
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerLandingPageConfig
    ]
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
      context: async ({ req }) => ({
        token: decrypt_JWT_Token(req.headers.jwt_token as string)
      })
    })
  )
  // swagger doc
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerFile))

  await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve))
  console.log(`🚀 Server ready at http://localhost:${PORT}/`)
}

booStrap()
