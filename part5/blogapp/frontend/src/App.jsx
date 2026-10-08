import { useState, useEffect, useRef } from 'react'

import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null })

  const blogFormRef = useRef()

  const sortAndSetBlogs = (blogs) => {
    const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
    setBlogs(sortedBlogs)
  }

  useEffect(() => {
    blogService.getAll().then((blogs) => sortAndSetBlogs(blogs))
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
      sortAndSetBlogs(blogs.concat(savedBlog))
      notifyWith(`a new blog ${savedBlog.title} by ${savedBlog.author} added`)
      blogFormRef.current.toggleVisibility()
      return true
    } catch {
      notifyWith('failed to create blog', true)
      return false
    }
  }

  const handleUpdateBlog = async (blogToUpdate) => {
    try {
      const updatedBlog = await blogService.update(blogToUpdate)
      sortAndSetBlogs(
        blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)),
      )
      notifyWith(`blog ${updatedBlog.title} updated`)
    } catch {
      notifyWith('failed to update blog', true)
    }
  }

  const handleDeleteBlog = async (blogToDelete) => {}

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
          blogFormRef={blogFormRef}
          handleUpdateBlog={handleUpdateBlog}
          userId={user.id}
          handleDeleteBlog={handleDeleteBlog}
        />
      ) : (
        <LoginForm handleLogin={handleLogin} />
      )}
    </>
  )
}

export default App
