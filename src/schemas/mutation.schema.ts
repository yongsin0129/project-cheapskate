import gql from 'graphql-tag'

export const Mutation_typeDefs = gql`
  type Mutation {
    # 使用者將指定電影加入收藏清單
    addFollowedMovies(MovieListId: String): User

    # 使用者將指定電影移除收藏清單
    removeFollowedMovies(MovieListId: String): User
  }
`
