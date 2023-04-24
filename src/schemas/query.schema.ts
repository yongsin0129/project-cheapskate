import gql from 'graphql-tag'

export const query_typeDefs = gql`
  type Query {
    # 測試 GraphQL server 的 query
    hello: String

    # 取得所有 user 資料 (可根據引數不同篩選資料)
    Users(searchString: String, take: Int, skip: Int): [User!]!

    # 取得所有 movie 資料 (可根據引數不同篩選資料)
    Movies(
      searchString: String
      take: Int
      skip: Int
      status: Status
    ): [MovieList!]!

    # 取得當下使用者資料( header 帶的 token )
    Me: User
  }

  enum Status {
    notReleased
    firstRound
    leaveFirstRound
    secondRound
    leaveSecondRound
    Streaming
  }
`
