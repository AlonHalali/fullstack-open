const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const bcrypt = require('bcrypt')

const api = supertest(app)

let token = null

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('whatAPass', 10)
    const newUser = new User({
      username: 'userTest',
      name: 'iHateTests',
      passwordHash,
    })

    const savedUser = await newUser.save()

    const userForToken = {
      username: savedUser.username,
      id: savedUser._id,
    }

    token = jwt.sign(userForToken, config.SECRET)

    const blogWithUser = helper.initialBlogs.map((b) => ({
      ...b,
      user: savedUser._id,
    }))
    await Blog.insertMany(blogWithUser)
  })

  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  describe('params check', () => {
    test("blogs' id are returned as id", async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const firstBlog = response.body[0]

      assert.ok(firstBlog.id)
      assert.strictEqual(firstBlog._id, undefined)
    })

    test('a valid blog with default likes 0', async () => {
      const newBlog = {
        title: 'New Blog can be default?',
        author: 'bo mi',
        url: 'http://bo-mi/chatGoogle.html',
      }

      const savedBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)

      const response = await api.get(`/api/blogs/${savedBlog.body.id}`)

      assert.strictEqual(response.body.likes, 0)
    })

    test('invalid blog does not saved without title', async () => {
      const newBlog = {
        author: 'titleHater123',
        url: 'http://titleWdym/titelsHates.html',
        likes: 81,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('invalid blog does not saved without url', async () => {
      const newBlog = {
        title: 'url is for nerds',
        author: 'urlHater',
        likes: 1,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('add blog', () => {
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'New Blog can be added?',
        author: 'Gemini. Chatgpt?',
        url: 'http://gemini-gpt/chatGoogle.html',
        likes: 621,
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const getResponse = await api.get('/api/blogs')
      assert.strictEqual(
        getResponse.body.length,
        helper.initialBlogs.length + 1,
      )

      const titles = getResponse.body.map((bl) => bl.title)
      assert(titles.includes(newBlog.title))
    })

    test('fails with status code 401 if token is not provided', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        title: 'New Blog without user can be added?',
        author: 'Gemini. Chatgpt?',
        url: 'http://gemini-gpt/chatGoogle.html',
        likes: 621,
      }

      await api.post('/api/blogs').send(newBlog).expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
  })

  describe('delete blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map((blog) => blog.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('update blog', () => {
    test('succeeds if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updatedBlog = { ...blogToUpdate, title: 'i love updates!' }

      await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()

      const titles = blogsAtEnd.map((blog) => blog.title)
      assert(titles.includes('i love updates!'))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })
})
after(async () => {
  await mongoose.connection.close()
})
