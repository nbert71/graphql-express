require('dotenv').config()

const { PrismaClient } = require('@prisma/client');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql');
const typeDefs = require('./schema.graphql');

const express = require('express');
const app = express()
const port = process.env.NODE_PORT

const prisma = new PrismaClient();

const types = buildSchema(typeDefs)
const resolvers = {
  Query: {
    users: () => { return prisma.user.findMany()},
    posts: () => { return prisma.post.findMany()},
    profiles: () => { return prisma.profile.findMany()},
  }
};

// const schema = makeExecutableSchema({ resolvers, types});

app.get('/', (req, res) => {
  res.send('Hello world !')
})

app.use('/api', graphqlHTTP({
  schema: types,
  rootValue: resolvers,
  graphiql: true
}))

app.use('/docs', express.static('docs'))

app.listen(port, () => {
  console.log(`The app is running on port ${port}`);
})