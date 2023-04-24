import { DateTimeResolver } from 'graphql-scalars'
import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'

import * as Type from '../generated/graphql'
import { MyContext } from '../types'

const prisma = new PrismaClient()

export const resolvers: Type.Resolvers = {
  // # 使用套件 graphql-scalars 定義 Type : DateTime
  DateTime: DateTimeResolver,

  Query: {
    // # 測試 GraphQL server 的 query
    hello: () => 'hello world',

    // # 取得所有 movie 資料 (可根據引數不同篩選資料)
    Movies: (root, args, context) => {
      const { searchString, take, skip, status } = args
      let and = {}
      if (searchString || status) {
        and = {
          AND: [
            { title: { contains: searchString as string } },
            { status: status }
          ]
        }
      }
      return prisma.movieList.findMany({
        where: { ...and },
        take: Number(take) || undefined,
        skip: Number(skip) || undefined
      })
    },

    // # 取得所有 user 資料 (可根據引數不同篩選資料)
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

    // # 取得當下使用者資料( header 帶的 token )
    Me: (root, args, context: MyContext) => {
      if (context.token === null) throw new GraphQLError('jwt token not found')
      return prisma.user.findUnique({ where: { id: context.token.id } })
    }
  },

  Mutation: {
    // # 使用者將指定電影加入收藏清單
    addFollowedMovies: async (root, args, context: MyContext) => {
      if (context.token === null) throw new GraphQLError('jwt token not found')
      const { id, email } = context.token
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

    // # 使用者將指定電影移除收藏清單
    removeFollowedMovies: async (root, args, context: MyContext) => {
      if (context.token === null) throw new GraphQLError('jwt token not found')
      const { id, email } = context.token
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

  // # 實作 User 與 followedMovies 關聯
  User: {
    followedMovies: async (parent, args, context) => {
      return await prisma.user
        .findUnique({ where: { id: parent.id! } })
        .followedMovies()
    }
  },

  // # 實作 MovieList 與 User 關聯
  MovieList: {
    followedByUsers: async (parent, args, context) => {
      return await prisma.movieList
        .findUnique({ where: { id: parent.id! } })
        .followedByUsers()
    }
  }
}
