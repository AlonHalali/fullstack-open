const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'cyker', 'cyker@2008')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'aBlogWithTitle', 'bloger', 'url.com')
      await expect(page.getByText('aBlogWithTitle bloger')).toBeVisible()
      const notification = page.getByText(
        'a new blog aBlogWithTitle by bloger added',
      )
      await expect(notification).toBeVisible()
      await expect(notification).toHaveCSS('border-style', 'solid')
      await expect(notification).toHaveCSS('color', 'rgb(0, 128, 0)')
    })

    describe('several blogs exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'blog1', 'halali', 'url.com')
        await createBlog(page, 'blog2', 'bloger', 'http.com')
        await createBlog(page, 'blog3', 'cyker', 'web.com')
      })

      test.only('add like to a blog', async ({ page }) => {
        const firstBlogTitle = page.getByText('blog1 halali')

        await firstBlogTitle.getByRole('button', { name: 'view' }).click()

        const blog = firstBlogTitle.locator('..')

        const likes = blog.locator('.likes-count')
        const likesBefore = Number(await likes.innerText())

        await blog.getByRole('button', { name: 'like' }).click()
        await page.getByText(`blog blog1 updated`).waitFor()

        await expect(likes).toHaveText(String(likesBefore + 1))
      })
    })
  })
})
