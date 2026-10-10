const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing')
    await request.post('/api/users', {
      data: {
        name: 'Alon Halali',
        username: 'cyker',
        password: 'cyker@2008',
      },
    })
    await page.goto('/')
  })

  test('login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'username' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'password' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'cyker', 'cyker@2008')
      await expect(page.getByRole('heading', { name: 'Blogs' })).toBeVisible()
      await expect(page.getByText('Alon Halali logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'cyker', 'wrongPassword')
      await expect(
        page.getByRole('heading', { name: 'Blogs' }),
      ).not.toBeVisible()
      await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })
})
