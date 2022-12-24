import gql from 'graphql-tag'

export const query_typeDefs = gql`
  type Query {
    hello: String
    Users(searchString: String, take: Int, skip: Int): [User!]!
    Movies(
      searchString: String
      take: Int
      skip: Int
      status: Status
    ): [MovieList!]!
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
