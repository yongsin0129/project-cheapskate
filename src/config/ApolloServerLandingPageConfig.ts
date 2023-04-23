import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault
} from '@apollo/server/plugin/landingPage/default'

// Install a landing page plugin based on NODE_ENV
export const ApolloServerLandingPageConfig =
  process.env.NODE_ENV === 'production'
    ? ApolloServerPluginLandingPageProductionDefault({
        graphRef: process.env.APOLLO_GRAPH_REF,
        footer: false
      })
    : ApolloServerPluginLandingPageLocalDefault({ footer: false })
