import { useState, useEffect } from 'react'

import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null })

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, isError = false) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification({ message: null })
    }, 5000)
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      return true
    } catch {
      notifyWith('wrong username or password', true)
      return false
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)

    notifyWith(`Logout successful!`)
  }

  const handleAddBlog = async (newBlog) => {
    try {
      const savedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(savedBlog))
      notifyWith(`a new blog ${savedBlog.title} by ${savedBlog.author} added`)
      return true
    } catch {
      notifyWith('failed to create blog', true)
      return false
    }
  }

  return (
    <>
      {user ? <h1>Blogs</h1> : <h1>Login</h1>}
      <Notification notification={notification} />
      {user ? (
        <Blogs
          blogs={blogs}
          userName={user.name}
          handleLogout={handleLogout}
          handleAddBlog={handleAddBlog}
        />
      ) : (
        <LoginForm handleLogin={handleLogin} />
      )}
    </>
  )
}

export default App
