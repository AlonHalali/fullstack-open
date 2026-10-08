import { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit = async (event) => {
    event.preventDefault()

    const success = await handleLogin({ username, password })
    if (success) {
      setUsername('')
      setPassword('')
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
export default LoginForm
