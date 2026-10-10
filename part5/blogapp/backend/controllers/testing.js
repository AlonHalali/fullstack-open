const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

testingRouter.post('/', async (request, response) => {
  User.deleteMany({})
  Blog.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter
