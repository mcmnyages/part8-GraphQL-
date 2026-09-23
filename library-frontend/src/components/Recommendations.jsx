import { ALL_BOOKS } from "../queries";
import { useQuery } from "@apollo/client/react";

const Recommendations = (props) => {
  const favorite = props.me?.favoriteGenre
    const response = useQuery(ALL_BOOKS, {
        variables: { genre: favorite },
    });


    if (!props.show) {
        return null;
    }

    if (response.loading) {
        return <div>Loading books ...</div>;
    }

    if (response.error) {
        return <div>Error loading books!</div>;
    }
    
    const books = response.data.allBooks
    return (
        <div>
            <h3>recommendations</h3>
            <p>books in your favourite genre <b>{favorite}</b></p>
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

export default Recommendations