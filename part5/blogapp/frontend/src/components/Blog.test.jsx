import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  const initialBlog = {
    title: 'blog to test',
    author: 'bloger123',
    url: 'https://url.com',
    likes: 2,
    user: {
      username: 'bloger123',
      name: 'MyName',
    },
  }

  beforeEach(() => {
    render(
      <Blog
        blog={initialBlog}
        handleUpdateBlog={() => {}}
        username={initialBlog.user.username}
        handleDeleteBlog={() => {}}
      />,
    )
  })

  test('at start only title and author are displayed', () => {
    const titleAndAuthorElement = screen.getByText(
      `${initialBlog.title} ${initialBlog.author}`,
    )
    const urlElement = screen.getByText(initialBlog.url)
    const likesElement = screen.getByText(initialBlog.likes)

    expect(titleAndAuthorElement).toBeVisible()
    expect(urlElement).not.toBeVisible()
    expect(likesElement).not.toBeVisible()
  })

  test('after click url and likes are visible', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const urlElement = screen.getByText(initialBlog.url)
    const likesElement = screen.getByText(initialBlog.likes)

    expect(urlElement).toBeVisible()
    expect(likesElement).toBeVisible()
  })
})
