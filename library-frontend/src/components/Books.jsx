import { ALL_BOOKS } from "../queries"
import { useQuery } from "@apollo/client/react"
const Books = (props) => {
  const response = useQuery(ALL_BOOKS)
  
  if(response.loading){
    return <div>Loading books ...</div>
  }

  if (!props.show) {
    return null
  }

  const books = response.data.allBooks

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
