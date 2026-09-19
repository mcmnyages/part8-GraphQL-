const Author = require('./models/author')
const Book = require('./models/book')

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            let query = {}

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
        allAuthors: async () => Author.find({})
    },
    Author: {
        bookCount: async (root) => {
            return Book.countDocuments({ author: root._id })
        }
    },
    Mutation: {
        addBook: async (root, args) => {
            let author = await Author.findOne({ name: args.author })

            if (!author) {
                author = new Author({ name: args.author })
                await author.save()
            }

            const book = new Book({ ...args, author: author._id })
            return book.save()
        },

        editAuthor: async (root, args) => {
            let author = await Author.findOne({ name: args.name })

            if (!author) {
                return null
            }

            author.born = args.setBornTo
            return author.save()
        }
    }
}

module.exports = resolvers