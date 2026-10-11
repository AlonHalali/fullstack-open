import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'

import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null })

  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

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
      navigate('/')
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
    navigate('/')
    notifyWith('Logout successful!')
  }

  const handleAddBlog = async (newBlog) => {
    try {
      const savedBlog = await blogService.create(newBlog)
      sortAndSetBlogs(blogs.concat(savedBlog))
      notifyWith(`a new blog ${savedBlog.title} by ${savedBlog.author} added`)
      navigate('/')
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

  const handleDeleteBlog = async (blogToDelete) => {
    if (
      window.confirm(
        `Remove blog ${blogToDelete.title} by ${blogToDelete.author}`,
      )
    ) {
      try {
        await blogService.remove(blogToDelete)
        sortAndSetBlogs(blogs.filter((b) => b.id !== blogToDelete.id))
        notifyWith(`blog ${blogToDelete.title} removed`)
        navigate('/')
      } catch {
        notifyWith('Failed to remove blog', true)
      }
    }
  }

  const padding = {
    padding: 5,
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">
          blogs
        </Link>
        {user && (
          <Link style={padding} to="/create">
            new blog
          </Link>
        )}
        {user ? (
          <button onClick={handleLogout}>logout</button>
        ) : (
          <Link style={padding} to="/login">
            login
          </Link>
        )}
      </div>

      <Notification notification={notification} />

      <Routes>
        <Route
          path="/"
          element={
            <Blogs
              blogs={blogs}
              name={user ? user.name : null}
              handleAddBlog={handleAddBlog}
            />
          }
        />

        <Route
          path="/login"
          element={<LoginForm handleLogin={handleLogin} />}
        />

        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              handleUpdateBlog={handleUpdateBlog}
              username={user ? user.username : null}
              handleDeleteBlog={handleDeleteBlog}
            />
          }
        />

        <Route
          path="/create"
          element={<BlogForm handleAddBlog={handleAddBlog} />}
        />
      </Routes>
    </div>
  )
}

export default App
