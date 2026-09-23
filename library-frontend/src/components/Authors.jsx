import { useState } from "react"
import { ALL_AUTHORS, EDIT_AUTHOR, ALL_BOOKS } from "../queries"
import { useMutation, useQuery } from "@apollo/client/react"

const Authors = (props) => {
  const results = useQuery(ALL_AUTHORS)
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [
      { query: ALL_AUTHORS },
      { query: ALL_BOOKS }
    ]
  })

  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    editAuthor({ variables: { name, setBornTo: Number(born) } })
    setName('')
    setBorn('')
  }


  if (results.loading) {
    return <div>Loading Authors...</div>
  }

  if (!props.show) {
    return null
  }
  const authors = results.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {props.token && <form onSubmit={handleSubmit}>
          <h3>Set birthyear</h3>
          <div>
            <label>
              name:
              <select
                name="name"
                value={name}
                onChange={({ target }) => setName(target.value)}
              >
                <option value="">Select author</option>
                {authors.map(author => (
                  <option key={author.id} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </label>

          </div>
          <div>
            <label >
              born
              <input
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </label>
          </div>
          <button type="submit">Update author</button>
        </form>
        }
      </div>
    </div>
  )
}

export default Authors
