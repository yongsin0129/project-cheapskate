import { query_typeDefs } from './query.schema'
import { Mutation_typeDefs } from './mutation.schema'
import { movie_typeDefs } from './movie.schema'
import { user_typeDefs } from './user.schema'

export const typeDefs = [
  query_typeDefs,
  movie_typeDefs,
  user_typeDefs,
  Mutation_typeDefs
]
