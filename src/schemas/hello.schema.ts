import { makeExecutableSchema } from '@graphql-tools/schema'
import gql from 'graphql-tag'

const typeDefs = gql`
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: () => 'hello world'
  }
}

export const hello_schema = makeExecutableSchema({ typeDefs, resolvers })
