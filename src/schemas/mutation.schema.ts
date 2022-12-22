import gql from 'graphql-tag'

export const Mutation_typeDefs = gql`
  type Mutation {
    addFollowedMovies(MovieListId: String): User
    removeFollowedMovies(MovieListId: String): User
  }
`
