const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { blogs: 0 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user
  body['user'] = user._id

  const blog = new Blog(body)
  const savedBlog = await blog.save()
  await savedBlog.populate('user', { blogs: 0 })

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) return response.status(404).end()

  await blog.populate('user', { blogs: 0 })
  response.json(blog)
})

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user

    const blogToDelete = await Blog.findById(request.params.id)
    if (!blogToDelete)
      return response.status(404).json({ error: 'blog not found!' })

    if (
      !blogToDelete.user ||
      blogToDelete.user.toString() !== user._id.toString()
    )
      return response
        .status(403)
        .json({ error: 'The user is not the blog owner' })

    user.blogs = user.blogs.filter(
      (b) => b.id.toString() !== blogToDelete.id.toString(),
    )
    await blogToDelete.deleteOne()
    response.status(204).end()
  },
)

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).end()

  blog.title = title ?? blog.title
  blog.author = author ?? blog.author
  blog.url = url ?? blog.url
  blog.likes = likes ?? blog.likes

  const updatedBlog = await blog.save()
  await updatedBlog.populate('user', { blogs: 0 })
  response.json(updatedBlog)
})

module.exports = blogsRouter
