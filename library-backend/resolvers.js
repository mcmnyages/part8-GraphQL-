const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const pubsub = new PubSub()

const resolvers = {
    Query: {
        me: (root, args, context) => {
            return context.currentUser
        },

        bookCount: async () => {
            return Book.collection.countDocuments()
        },

        authorCount: async () => {
            return Author.collection.countDocuments()
        },

        allBooks: async (root, args) => {
            const query = {}

            if (args.author) {
                const author = await Author.findOne({ name: args.author })

                if (!author) {
                    return []
                }

                query.author = author._id
            }

            if (args.genre) {
                query.genres = args.genre
            }

            return Book.find(query).populate('author')
        },

        allAuthors: async () => {
            return Author.find({})
        },
    },

    Author: {
        bookCount: async (author) => {
            return Book.countDocuments({ author: author._id })
        },
    },

    Mutation: {
        createUser: async (root, args) => {
            try {
                const user = new User({
                    username: args.username,
                    favoriteGenre: args.favoriteGenre,
                })

                return await user.save()
            } catch (error) {
                throw new GraphQLError(`Creating the user failed: ${error.message}`, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.username,
                        error,
                    },
                })
            }
        },

        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if (!user || args.password !== 'secret') {
                throw new GraphQLError('wrong credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                })
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            const token = jwt.sign(userForToken, process.env.JWT_SECRET)

            return { value: token }
        },

        addBook: async (root, args, context) => {
            if (!context.currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                    },
                })
            }

            try {
                let author = await Author.findOne({ name: args.author })

                if (!author) {
                    author = new Author({ name: args.author })
                    await author.save()
                }

                const book = new Book({
                    ...args,
                    author: author._id,
                })

                await book.save()
                const populatedBook = await book.populate('author')

                await pubsub.publish('BOOK_ADDED', {
                    bookAdded: populatedBook,
                })

                return populatedBook
            } catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                })
            }
        },

        editAuthor: async (root, args, context) => {
            if (!context.currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                    },
                })
            }

            try {
                const author = await Author.findOne({ name: args.name })

                if (!author) {
                    return null
                }

                author.born = args.setBornTo
                return await author.save()
            } catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                })
            }
        },

        _resetDatabase: async () => {
            if (process.env.NODE_ENV !== 'test') {
                throw new GraphQLError('_resetDatabase is only available in test mode')
            }

            await Author.deleteMany({})
            await Book.deleteMany({})
            await User.deleteMany({})

            return true
        },
    },

    Subscription: {
        bookAdded: {
            subscribe: () => {
                return pubsub.asyncIterableIterator('BOOK_ADDED')
            },
        },
    },
}

module.exports = resolvers