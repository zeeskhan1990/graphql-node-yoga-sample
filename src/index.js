import {GraphQLServer} from "graphql-yoga"

//Type defs (schema)

const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        add(numbers: [Int]!): Int!
        grades: [Int]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }

`

//Resolvers

const resolvers = {
    Query: {
        greeting(parent, args, ctx, info) {
            console.log(args)
            return args.name ? `Hello ${args.name}` : "Hello"
        },
        add(parent, args) {
            //return args.a + args.b
            let numberArr = args.numbers
            let sum = numberArr.reduce((a,b) => a + b)
            return sum
        },
        grades(parent, args, ctx, info) {
            return [99, 80, 93]
        },
        me() {
            return {
                id: 999,
                name: "prius",
                email:"prius@prius.com" 
            }
        },
        post() {
            return {
                id: 100,
                title: 'Hello Post',
                body: "Body of hello post",
                published: true
            }
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is running')
})