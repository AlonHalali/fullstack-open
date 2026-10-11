import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import {
  Container,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
} from '@mui/material'

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
  const [notification, setNotification] = useState(null)

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

  const notifyWith = (text, type = 'success') => {
    setNotification({ text, type })
    setTimeout(() => {
      setNotification(null)
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
      notifyWith('wrong username or password', 'error')
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
      notifyWith(
        `a new blog ${savedBlog.title} by ${savedBlog.author} added`,
        'info',
      )
      navigate('/')
      return true
    } catch {
      notifyWith('failed to create blog', 'error')
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
      notifyWith('failed to update blog', 'error')
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
        notifyWith(`blog ${blogToDelete.title} removed`, 'info')
        navigate('/')
      } catch {
        notifyWith('Failed to remove blog', 'error')
      }
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            Blog App
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button color="inherit" component={Link} to="/">
              blogs
            </Button>

            {user && (
              <Button color="inherit" component={Link} to="/create">
                new blog
              </Button>
            )}

            {user ? (
              <Button color="inherit" onClick={handleLogout}>
                logout
              </Button>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container>
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
      </Container>
    </>
  )
}

export default App
