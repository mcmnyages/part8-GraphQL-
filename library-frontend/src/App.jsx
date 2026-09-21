import { useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { ME } from './queries'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'


const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('libraryUserToken'))
  const client = useApolloClient()

  const response = useQuery(ME)

  if (response.loading) {
    return <div>Authenticating user ...</div>
  }

  const me = response.data?.me
  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token &&
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommendations')}>Recommendations</button>
          </>
        }
        {!token ?
          <button onClick={() => setPage('login')}>login</button> :
          <button onClick={() => onLogout()}>logout</button>
        }
      </div>

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />
      <Recommendations show={page=='recommendations'} me={me}/>

      {page == 'login' && <LoginForm show={page === 'login'} setToken={setToken} />}
    </div>
  )
}

export default App
