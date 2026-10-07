const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helper')
const mongoose = require('mongoose')
const User = require('../models/user')
const app = require('../app')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('users_api test', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('whatAPass', 10)
    const newUser = new User({
      username: 'userTest',
      name: 'iHateTests',
      passwordHash,
    })

    await newUser.save()
  })
  test('get all users', async () => {
    const usersAtStart = await helper.usersInDb()

    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, usersAtStart.length)
  })

  describe('create user', () => {
    test('a valid user create', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'newUser123',
        name: 'bestUser',
        password: 'password',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map((user) => user.username)
      assert(usernames.includes(newUser.username))
    })

    test('failed user create : without an username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        name: 'usernameIsForWeak',
        password: 'usernameNop',
      }

      await api.post('/api/users').send(newUser).expect(400)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('failed user create : with a short password', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'longIsBoring',
        name: 'shortIsBetter',
        password: 'sh',
      }

      await api.post('/api/users').send(newUser).expect(400)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('failed user create : with exist username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'userTest',
        name: 'sameUsername',
        password: '12345',
      }

      await api.post('/api/users').send(newUser).expect(400)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })
})

after(async () => {
  mongoose.connection.close()
})
