import { makeExecutableSchema } from '@graphql-tools/schema'
import gql from 'graphql-tag'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const typeDefs = gql`
  type Query {
    allMovies: [MovieList!]!
  }

  type MovieList {
    id: ID!
    title: String
    releaseDate: String
    url: String
    status: Status
    createAt: String
    updataAt: String
  }

  enum Status {
    notReleased
    firstRound
    leaveFirstRound
    secondRound
    leavesecondRound
    Streaming
  }
`

const resolvers = {
  Query: {
    allMovies: () => prisma.movieList.findMany()
  }
}

export const movie_schema = makeExecutableSchema({ typeDefs, resolvers })
