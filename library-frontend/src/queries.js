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
    genres
  }
}
`