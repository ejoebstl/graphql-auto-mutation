![Build Status](https://travis-ci.org/ejoebstl/graphql-auto-mutation.svg?branch=master)

# graphql-auto-mutation 

Write less, do more. :rocket: 

Automatically generates functions for mutations specified in a GraphQL schema. 

## Usage

```sh
npm install --save graphql-auto-mutation
```

```javascript
import createMutations from 'graphql-auto-mutation'

const api = createMutations(YOUR_ENDPOINT_URL)

api.myCoolMutation({arg1: '1', arg2: 2})
```

## Example using graphcool

Please consider the following schema, hosted on [graphcool](https://www.graph.cool/): 

```graphql
type Tweet {
  id: ID!
  text: String!
  author: User! @relation(name: "Tweets")
}

type User {
  id: ID!
  name: String!
  tweets: [Tweet!]! @relation(name: "Tweets")
}
```

The graphcool BaaS can automatically create mutations for this schema for us. You can easily try it for yourself, using their awesome [graphql-up tool](https://github.com/graphcool/graphql-up). 

Since the mutations are all exposed in the schema, we can just let `graphql-auto-mutation` utilize the endpoint to generate corresponding function calls. `graphql-auto-mutation` will generate a function for each mutation specified in the schema. The function will have the same name as the mutation. Parameters are passed inside an object. When called, the function returns a promise which resolves to the ID of the mutated node. 

```javascript
import createMutations from 'graphql-auto-mutation'
const url = 'https://api.graph.cool/simple/v1/carnationleg-cloud-268'

// Fetches schema and generates functions for all mutations 
const twitter = await createMutations(url)

// Call your mutations!
const userId = await twitter.createUser({name: 'Hugo'})
const tweetId = await twitter.createTweet({authorId: userId, text: 'Test Tweet'})
await twitter.updateTweet({id: tweetId, text: 'New Text for Tweet'})
```

Of course, you can also use this tool against your own API!

## Options

The following options are available:

```javascript
import createMutations from 'graphql-auto-mutation'

createMutations(url, authorizationHeaderToken)
createMutations.withHeaders(url, headers) 
createMutations.withResolver(url, customResolver)
createMutations.withSchema(schema, authorizationHeaderToken)
createMutations.withSchemaAndHeaders(url, schema, headers)
createMutations.withResolverAndSchema(customResolver, headers)
```

A custom resolver is essentialy a function which receives the GraphQL parameter as first parameter and all query variables as second parameter. 

## What is supported?

At the moment, `graphql-auto-mutation` only supports mutations with scalar input types. Nested mutations are not supported. 

## Why should I use this? 

GraphQL is awesome when it comes to querying data. However, when nodes are updated or created, calling mutations requires multiple lines of code. Especially for cool BaaS like [graphcool](https://www.graph.cool/), mutations can be very generic. Developers end up writing similar mutations over and over again. Using this tool, executing a mutation becomes as simple as writing a function call. 



