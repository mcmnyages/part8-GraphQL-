const { v1: uuid } = require('uuid')
const Author = require('./models/author')
const Book = require('./models/book')

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (root, args) => {
     return await Book.find({})
    },
    allAuthors: async() => await Author.find({})
  },
  Author: {
    bookCount: async(root) => await Book.countDocuments({author:root._id})
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

    editAuthor: (root, args) => {
      let author = Author.find(a => a.name === args.name)
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      return author
    }
  }
}

module.exports= resolvers