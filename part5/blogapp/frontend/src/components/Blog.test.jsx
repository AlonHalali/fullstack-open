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

  let mockUpdateBlog
  let mockDeleteBlog

  beforeEach(() => {
    mockUpdateBlog = vi.fn()
    mockDeleteBlog = vi.fn()
    render(
      <Blog
        blog={initialBlog}
        handleUpdateBlog={mockUpdateBlog}
        username={initialBlog.user.username}
        handleDeleteBlog={mockDeleteBlog}
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

  test('double click at like button', async () => {
    const user = userEvent.setup()

    const viewButton = screen.getByRole('button', { name: 'view' })
    await user.click(viewButton)

    const likeButton = screen.getByRole('button', { name: 'like' })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdateBlog.mock.calls).toHaveLength(2)
  })
})
