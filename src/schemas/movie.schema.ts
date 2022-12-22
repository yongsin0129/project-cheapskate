import gql from 'graphql-tag'

export const movie_typeDefs = gql`
  scalar DateTime

  type MovieList {
    id: ID!
    title: String!
    releaseDate: String!
    url: String
    status: String!
    createAt: DateTime
    updateAt: DateTime
    followedByUsers: [User]
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
