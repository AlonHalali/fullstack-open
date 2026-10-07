const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { blogs: 0 })
  response.json(blogs)
})

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (!authorization || !authorization.startsWith('Bearer ')) return null
  return authorization.replace('Bearer ', '')
}

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const token = getTokenFrom(request)
  if (!token) return response.status(401).json({ error: 'token missing' })

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id)
    return response.status(401).json({ error: 'token invalid' })

  const user = await User.findById(decodedToken.id)
  if (!user)
    return response.status(400).json({ error: 'userId missing or not valid' })
  body['user'] = user._id

  const blog = new Blog(body)

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) return response.status(404).end()

  response.json(blog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).end()

  blog.title = title ?? blog.title
  blog.author = author ?? blog.author
  blog.url = url ?? blog.url
  blog.likes = likes ?? blog.likes

  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter
