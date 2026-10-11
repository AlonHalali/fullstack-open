import { useState } from 'react'
import { Stack, TextField, Button } from '@mui/material'

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
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            id="filled-username"
            label="Username"
            variant="filled"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />

          <TextField
            id="filled-password"
            label="Password"
            variant="filled"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />

          <Button variant="contained" type="submit">
            Login
          </Button>
        </Stack>
      </form>
    </div>
  )
}
export default LoginForm
