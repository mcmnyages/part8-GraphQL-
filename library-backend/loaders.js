const DataLoader = require('dataloader')
const Book = require('./models/book')

const createLoaders = () => {
    const authorBookCountLoader = new DataLoader(
        async (authorIds) => {
            const books = await Book.find({
                author: {
                    $in: authorIds,
                },
            })

            const counts = {}

            books.forEach((book) => {
                const authorId = book.author.toString()
                counts[authorId] = (counts[authorId] || 0) + 1
            })

            return authorIds.map((authorId) => {
                return counts[authorId.toString()] || 0
            })
        }
    )

    return {
        authorBookCountLoader,
    }
}

module.exports = createLoaders
