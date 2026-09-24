import { useState } from 'react'
import { useMutation} from '@apollo/client/react'
import { CREATE_BOOK, BOOK_ADDED, ALL_BOOKS } from '../queries'
import { bookToAdd, authorToAdd } from '../utils/apolloCache'


const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

 const [createBook] = useMutation(CREATE_BOOK, {
    update: (cache, response) => {
      const addedBook = response.data.addBook
      bookToAdd(cache, addedBook)
      authorToAdd(cache, addedBook)
    },
    onError: (error) => {
      console.error(error)
    },
  })


  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    try {
       await createBook({ variables: { title, author, published, genres } })
    } catch (error) {
      props.setError('There was an error')
      console.error('CREATE_BOOK failed:', error)
    }

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label>
            title
            <input
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            published
            <input
              type="number"
              value={published}
              onChange={({ target }) => setPublished(Number(target.value))}
            />
          </label>
        </div>
        <div>
          <label>
            <input
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
            />
            <button onClick={addGenre} type="button">
              add genre
            </button>
          </label>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
