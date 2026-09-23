import { ALL_BOOKS, ALL_AUTHORS } from '../queries'

export const bookToAdd = (cache, bookToAdd) => {
  cache.updateQuery({ query: ALL_BOOKS, variables: { genre: null } }, (data) => {
      if (!data) {
        return { allBooks: [bookToAdd] }
      }

      const bookExists = data.allBooks.some((book) => book.id === bookToAdd.id)

      if (bookExists) {
        return data
      }

      return {
        allBooks: data.allBooks.concat(bookToAdd),
      }
    }
  )
}

export const authorToAdd = (cache, bookToAdd) => {
  cache.updateQuery({ query: ALL_AUTHORS }, (data) => {
    if (!data) {
      return { allAuthors: [bookToAdd.author] }
    }

    const newAuthor = bookToAdd.author

    const authorExists = data.allAuthors.some(
      (author) => author.id === newAuthor.id
    )

    if (authorExists) {
      return {
        allAuthors: data.allAuthors.map((author) =>
          author.id === newAuthor.id
            ? {
                ...author,
                bookCount: author.bookCount + 1,
              }
            : author
        ),
      }
    }

    return {
      allAuthors: data.allAuthors.concat(newAuthor),
    }
  })
}
