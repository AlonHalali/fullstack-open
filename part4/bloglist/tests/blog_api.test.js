const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const helper = require('./test_helper.js')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test("blogs' id are returned as id", async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const firstBlog = response.body[0]

  assert.ok(firstBlog.id)
  assert.strictEqual(firstBlog._id, undefined)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New Blog can be added?',
    author: 'Gemini. Chatgpt?',
    url: 'http://gemini-gpt/chatGoogle.html',
    likes: 621,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const getResponse = await api.get('/api/blogs')
  assert.strictEqual(getResponse.body.length, helper.initialBlogs.length + 1)

  const titles = getResponse.body.map((bl) => bl.title)
  assert(titles.includes(newBlog.title))
})

after(async () => {
  await mongoose.connection.close()
})
