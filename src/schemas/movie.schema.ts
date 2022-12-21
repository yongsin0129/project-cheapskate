import { makeExecutableSchema } from '@graphql-tools/schema'
import gql from 'graphql-tag'
import * as Type from '../generated/graphql'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { DateTimeResolver } from 'graphql-scalars'

const typeDefs = gql`
  scalar DateTime

  type Query {
    Movies: [MovieList!]!
  }

  type MovieList {
    id: ID!
    title: String!
    releaseDate: String!
    url: String
    status: String!
    createAt: DateTime
    updateAt: DateTime
  }
  # """
  # Status 共有六種電影的現在上映狀態
  # prisma 的 enum 跟 graphql 的 enum 會有 type不合的問題 , 先把 status 的類型改為 String
  # prisma issue : https://github.com/prisma/prisma/issues/12659
  # """
  # enum Status {
  #   notReleased
  #   firstRound
  #   leaveFirstRound
  #   secondRound
  #   leaveSecondRound
  #   Streaming
  # }
`
// :Type.Resolvers
const resolvers: Type.Resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    Movies: () => prisma.movieList.findMany()
  }
}

export const movie_schema = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers
})
