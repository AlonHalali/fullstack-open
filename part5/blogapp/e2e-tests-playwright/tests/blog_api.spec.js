const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

const blogsOwnerUser = {
  name: 'Alon Halali',
  username: 'cyker',
  password: 'cyker@2008',
}

const secondUser = {
  name: 'bob',
  username: 'babyBob',
  password: 'bobMax',
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing')
    await request.post('/api/users', {
      data: blogsOwnerUser,
    })
    await request.post('/api/users', {
      data: secondUser,
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
      await loginWith(page, blogsOwnerUser.username, blogsOwnerUser.password)
      await expect(page.getByRole('heading', { name: 'Blogs' })).toBeVisible()
      await expect(
        page.getByText(`${blogsOwnerUser.name} logged in`),
      ).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, blogsOwnerUser.username, 'wrong')
      await expect(
        page.getByRole('heading', { name: 'Blogs' }),
      ).not.toBeVisible()
      await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, blogsOwnerUser.username, blogsOwnerUser.password)
      await expect(
        page.getByText(`${blogsOwnerUser.name} logged in`),
      ).toBeVisible()
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

    describe('Several blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'blog1', 'halali', 'url.com')
        await createBlog(page, 'blog2', 'bloger', 'http.com')
        await createBlog(page, 'blog3', 'cyker', 'web.com')
      })

      test('add like to a blog', async ({ page }) => {
        const firstBlogTitle = page.getByText('blog1 halali')

        await firstBlogTitle.getByRole('button', { name: 'view' }).click()

        const blog = firstBlogTitle.locator('..')

        const likes = blog.locator('.likes-count')
        const likesBefore = Number(await likes.innerText())

        await blog.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText(`blog blog1 updated`)).toBeVisible()

        await expect(likes).toHaveText(String(likesBefore + 1))
      })

      test('remove blog', async ({ page }) => {
        page.on('dialog', (dialog) => dialog.accept())

        const firstBlogTitle = page.getByText('blog1 halali')
        await firstBlogTitle.getByRole('button', { name: 'view' }).click()
        const blog = firstBlogTitle.locator('..')

        const removeButton = blog.getByRole('button', { name: 'remove' })
        await expect(removeButton).toBeVisible()

        await removeButton.click()

        await expect(page.getByText('blog blog1 removed')).toBeVisible()
        await expect(blog).toHaveCount(0)
      })

      describe('When logged in as a non-owner', () => {
        beforeEach(async ({ page }) => {
          await page.getByRole('button', { name: 'logout' }).click()
          await expect(
            page.getByRole('heading', { name: 'Login' }),
          ).toBeVisible()
          await loginWith(page, secondUser.username, secondUser.password)
          await expect(
            page.getByText(`${secondUser.name} logged in`),
          ).toBeVisible()
        })

        test('non-owner cannot see the remove button', async ({ page }) => {
          const firstBlogTitle = page.getByText('blog1 halali')
          await firstBlogTitle.getByRole('button', { name: 'view' }).click()
          const blog = firstBlogTitle.locator('..')

          await expect(
            blog.getByRole('button', { name: 'remove' }),
          ).toHaveCount(0)
        })
      })
    })
  })
})
