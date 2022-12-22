import gql from 'graphql-tag'

export const user_typeDefs = gql`
  scalar DateTime

  type User {
    id: String
    name: String
    email: String
    createAt: DateTime
    updateAt: DateTime
    followedMovies: [MovieList]
  }
`
