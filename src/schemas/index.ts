const { mergeSchemas } = require('@graphql-tools/schema')
import { hello_schema } from './hello.schema'
import { movie_schema } from './movie.schema'

export const schema = mergeSchemas({
  schemas: [hello_schema, movie_schema]
})
