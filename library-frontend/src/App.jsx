import { useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client/react'

import { ME } from './queries'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { useToken, useLogout } from './useUserStore'

const App = () => {
  const [page, setPage] = useState('authors')
  const client = useApolloClient()
  const token = useToken()
  const logoutUser = useLogout()
  const response = useQuery(ME, {
    skip: !token
  })

  if (token && response.loading) {
    return <div>Authenticating user ...</div>
  }

  const me = response.data?.me
  const onLogout = async () => {
    await logoutUser(client) // Now safely passes client to reset the Apollo cache
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}> authors  </button>
        <button onClick={() => setPage('books')}>  books  </button>

        {token && (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommendations')} > Recommendations  </button>
          </>
        )}

        {!token ? (
          <button onClick={() => setPage('login')}>login  </button>
        ) : (
          <button onClick={onLogout}>logout </button>
        )}
      </div>

      <Authors show={page === 'authors'} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
      <Recommendations show={page === 'recommendations'} me={me} />

      {page === 'login' && (
        <LoginForm setPage={setPage}/>
      )}
    </div>
  )
}

export default App
