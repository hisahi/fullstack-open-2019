
require('dotenv').config()
const { ApolloServer, gql, AuthenticationError, UserInputError, PubSub } = require('apollo-server')
const uuid = require('uuid/v1')
const mongoose = require('mongoose')
const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')
const jwt = require('jsonwebtoken')
const pubsub = new PubSub()

const JWT_SECRET = process.env.JWT_SECRET
const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {
  Author: {
    bookCount: (root) => {
      return Book.where({ 'author.name': root.name }).countDocuments() // no idea why this does not work...
    }
  },
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: (root, args) => {
      const filter = {}

      if (args.author) {
        filter.author = args.author
      }
      if (args.genre) {
        filter.genres = args.genre
      }

      return Book.find(filter).populate('author')
    },
    allAuthors: () => Author.find({}),
    me: (root, args, context) => (context.currentUser || null)
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const book = { ...args, id: uuid() }

      let author = await Author.findOne({ name: book.author })
      if (!author) {
        author = { name: args.author, born: null }

        try {
          author = await new Author(author).save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      }
      book.author = author.id;

      const addBook = new Book(book)
      try {
        await addBook.save()
        const populatedBook = addBook.populate('author').execPopulate()

        pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook })

        return populatedBook
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      }
      if (args.setBornTo) {
        author.born = args.setBornTo;
      }

      try {
        return author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      try {
        return user.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
  
  Subscription: {
    bookAdded: {      
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])    
    },  
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
  introspection: true,  
  playground: true,
})

const port = 3100; // for some bizarre reason port 4000 would not work for me
                   // that is also why I tried to get the playground to work
                   // separately, and I didn't bother to remove it again

server.listen(port).then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
