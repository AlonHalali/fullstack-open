import { expect } from '@playwright/test'

const goToLogin = async (page) => {
  await page.getByRole('link', { name: 'login' }).click()
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
}

const goToCreate = async (page) => {
  await page.getByRole('link', { name: 'new blog' }).click()
  await expect(
    page.getByRole('heading', { name: 'Create new blog' }),
  ).toBeVisible()
}

const goHome = async (page) => {
  await page.getByRole('link', { name: 'blogs' }).click()
  await expect(page.getByRole('heading', { name: 'Blogs' })).toBeVisible()
}

const goToBlog = async (page, title, author) => {
  await goHome(page)
  await page.getByRole('link', { name: `${title} ${author}` }).click()
  await expect(page.getByRole('heading', { name: title })).toBeVisible()
}

const loginWith = async (page, username, password) => {
  await goToLogin(page)
  await page.getByRole('textbox', { name: 'username' }).fill(username)
  await page.getByRole('textbox', { name: 'password' }).fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await goToCreate(page)
  await page.getByRole('textbox', { name: 'Title' }).fill(title)
  await page.getByRole('textbox', { name: 'Author' }).fill(author)
  await page.getByRole('textbox', { name: 'URL' }).fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByRole('link', { name: `${title} ${author}` }).waitFor()
}

export { goToLogin, goToCreate, goHome, goToBlog, loginWith, createBlog }
