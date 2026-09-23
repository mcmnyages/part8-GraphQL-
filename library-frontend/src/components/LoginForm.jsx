import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'
import { useLogin } from '../useUserStore'

const LoginForm = ({ setError,setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const loginUser = useLogin()


  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      loginUser(token)
      setPage('authors')
    },
    onError: (error) => {
      setError(error.message)
    }
  })

  const submit = (event) => {
    event.preventDefault()

    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <label>
          <div>
            username{' '}
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
        </label>

        <div>
          <label>
            password{' '}
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>


        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
