import { useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client/react'

import { ME } from './queries'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import Recommendations from './components/Recommendations'
import { useToken, useLogout } from './useUserStore'

const App = () => {
  const [errorMessage,setErrorMessage]=useState(null)
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

 const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const onLogout = async () => {
    await logoutUser(client) 
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
      <Notify errorMessage={errorMessage}/>
      <Authors show={page === 'authors'} token={token}/>
      <Books show={page === 'books'} setError={notify}/>
      <NewBook show={page === 'add'} setError={notify}/>
      <Recommendations show={page === 'recommendations'} me={me} />

      {page === 'login' && (
        <LoginForm setPage={setPage} setError={notify}/>
      )}
    </div>
  )
}

export default App
