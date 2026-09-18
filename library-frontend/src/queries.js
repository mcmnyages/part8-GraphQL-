import { gql } from "@apollo/client"

export const ALL_AUTHORS = gql`
query{
  allAuthors {
    id
    bookCount
    name
    born
  }
}`

export const ALL_BOOKS = gql `
query{
  allBooks {
    id
    title
    published
    author
  }
}
`

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      id
      title
      author
      published
      genres
    }
  }
`
