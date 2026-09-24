import { useState } from "react";
import { ALL_BOOKS, BOOK_ADDED } from "../queries";
import { useQuery, useSubscription, useApolloClient } from "@apollo/client/react";

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState('all');
  const client = useApolloClient()

  const response = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre === 'all' ? null : selectedGenre },
  });

  const sub = useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const newBook = data.data.bookAdded
      const variables = { genre: selectedGenre === 'all' ? null : selectedGenre, }
      client.cache.updateQuery({ query: ALL_BOOKS, variables }, (data) => {
        if (!data) return data
        return {
          allBooks: data.allBooks.concat(newBook)
        }
      }
      )

    }
  })
console.log('Sub',sub)


  if (!props.show) {
    return null;
  }

  if (response.loading) {
    return <div>Loading books ...</div>;
  }

  if (response.error) {
    console.log(response.error)
    return <div>Error loading books!</div>;
  }

  const books = response.data.allBooks;


  const allGenres = [...new Set(
    books.flatMap(book => book.genres)
  )];

  return (
    <div>
      <h2>books</h2>
      <p>in genre:<b>{selectedGenre}</b></p>
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
      <div>
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            style={{ fontWeight: selectedGenre === genre ? 'bold' : 'normal', marginRight: '5px' }}
          >
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre('all')}> all genres </button>
      </div>
    </div>
  );
};

export default Books;