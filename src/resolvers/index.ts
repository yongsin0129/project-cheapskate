import * as Type from '../generated/graphql'
import { DateTimeResolver } from 'graphql-scalars'
import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'
// apollo v4 error handling list : https://www.apollographql.com/docs/apollo-server/data/errors
const prisma = new PrismaClient()

export const resolvers: Type.Resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    hello: () => 'hello world',
    Movies: (root, args, context) => {
      const { searchString, take, skip } = args
      const or = searchString
        ? { OR: [{ title: { contains: searchString as string } }] }
        : {}
      return prisma.movieList.findMany({
        where: { ...or },
        take: Number(take) || undefined,
        skip: Number(skip) || undefined
      })
    },
    Users: (root, args, context) => {
      const { searchString, take, skip } = args
      const or = searchString
        ? { OR: [{ name: { contains: searchString as string } }] }
        : {}
      return prisma.user.findMany({
        where: { ...or },
        take: Number(take) || undefined,
        skip: Number(skip) || undefined
      })
    },
    Me: (root, args, context) => {
      if (context.token === null) throw new GraphQLError('jwt token not found')
      return prisma.user.findUnique({ where: { id: context.token.id } })
    }
  },
  Mutation: {
    addFollowedMovies: async (root, args, context) => {
      if (context.token === null) throw new GraphQLError('jwt token not found')
      const { id, name, email } = context.token
      const { MovieListId } = args

      try {
        return await prisma.user.update({
          where: { id },
          data: {
            followedMovies: { connect: { id: MovieListId! } }
          }
        })
      } catch (error) {
        throw new GraphQLError(`${error}`)
      }
    },
    removeFollowedMovies: async (root, args, context) => {
      if (context.token === null) throw new GraphQLError('jwt token not found')
      const { id, name, email } = context.token
      const { MovieListId } = args

      try {
        return await prisma.user.update({
          where: { id },
          data: {
            followedMovies: { disconnect: { id: MovieListId! } }
          }
        })
      } catch (error) {
        throw new GraphQLError(`${error}`)
      }
    }
  },
  User: {
    followedMovies: async (parent, args, context) => {
      return await prisma.user
        .findUnique({ where: { id: parent.id! } })
        .followedMovies()
    }
  },
  MovieList: {
    followedByUsers: async (parent, args, context) => {
      return await prisma.movieList
        .findUnique({ where: { id: parent.id! } })
        .followedByUsers()
    }
  }
}
