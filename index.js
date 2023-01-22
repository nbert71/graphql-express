require('dotenv').config()

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const graphql = require('graphql')
const {GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLList, GraphQLString, GraphQLBoolean} = graphql;
const { graphqlHTTP } = require('express-graphql')

const express = require('express');
const app = express()
const port = process.env.NODE_PORT

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: {type: GraphQLInt},
        email: {type: GraphQLString},
        first_name: {type: GraphQLString},
        last_name: {type: GraphQLString},
        posts: {type: GraphQLList(PostType)},
        profile: {type: ProfileType}
    })
})

const PostType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
        id: {type: GraphQLInt},
        createdAt: {type: GraphQLString},
        updatedAt: {type: GraphQLString},
        title: {type: GraphQLString},
        content: {type: GraphQLString},
        published: {type: GraphQLBoolean},
        author_id: {type: GraphQLInt},
        author: {type: UserType}
    })
})

const ProfileType = new GraphQLObjectType({
    name: "Profile",
    fields: () => ({
        id: {type: GraphQLInt},
        bio: {type: GraphQLString},
        user_id: {type: GraphQLInt},
        user: {type: UserType}
    })
})


const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllUsers: {
            type: GraphQLList(UserType),
            async resolve(parent, args) {
                return await prisma.user.findMany()
            }
        },
        getAllPosts: {
            type: GraphQLList(PostType),
            async resolve(parent, args) {
                return await prisma.post.findMany()
            }
        },
        getAllProfiles: {
            type: GraphQLList(ProfileType),
            async resolve(parent, args) {
                return await prisma.profile.findMany()
            }
        }
    }
})
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: {
            type: UserType,
            args: {
                email: {type: GraphQLString},
                first_name: {type: GraphQLString},
                last_name: {type: GraphQLString},
            },
            async resolve(parent, args) {
                await prisma.user.create({data: {
                    email: args.email,
                    first_name: args.first_name,
                    last_name: args.last_name
                }})
                return args
            }
        },
        createProfile: {
            type: ProfileType,
            args: {
                bio: {type: GraphQLString},
                user_id: {type: GraphQLInt}
            },
            async resolve(parent, args) {
                await prisma.profile.create({data: {
                    bio: args.bio,
                    user_id: args.user_id,
                }})
                return args
            }
        },
        createPost: {
            type: PostType,
            args: {
                title: {type: GraphQLString},
                content: {type: GraphQLString},
                published: {type: GraphQLBoolean},
                author_id: {type: GraphQLInt},
            },
            async resolve(parent, args) {
                await prisma.post.create({data:{
                    title: args.title,
                    content: args.content,
                    published: args.published,
                    author_id: args.author_id
                }})
                return args
            }
        }
    }
})

const schema = new GraphQLSchema({query: RootQuery, mutation: Mutation})

app.use('/api', graphqlHTTP({
    schema,
    graphiql: true
}))

app.get('/', (req, res) => {
    res.send('Hello world !')
})

app.use('/docs', express.static('docs'))

app.listen(port, () => {
    console.log(`The app is running on port ${port}`);
})