import { render, screen } from '@testing-library/react'
import Blog from './Blog'

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

  describe('when user not logged in', () => {
    beforeEach(() => {
      mockUpdateBlog = vi.fn()
      mockDeleteBlog = vi.fn()
      render(
        <Blog
          blog={initialBlog}
          handleUpdateBlog={mockUpdateBlog}
          username={null}
          handleDeleteBlog={mockDeleteBlog}
        />,
      )
    })

    test('only blog info and likes count are visible', () => {
      expect(
        screen.getByRole('heading', {
          name: `${initialBlog.author}: ${initialBlog.title}`,
        }),
      ).toBeVisible()
      expect(screen.getByText(initialBlog.url)).toBeVisible()
      expect(screen.getByText(`likes ${initialBlog.likes}`)).toBeVisible()
      expect(
        screen.getByText(`Added by ${initialBlog.user.name}`),
      ).toBeVisible()

      expect(
        screen.queryByRole('button', { name: 'like' }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'remove' }),
      ).not.toBeInTheDocument()
    })
  })

  describe('when non-owner logged in', () => {
    beforeEach(() => {
      mockUpdateBlog = vi.fn()
      mockDeleteBlog = vi.fn()
      render(
        <Blog
          blog={initialBlog}
          handleUpdateBlog={mockUpdateBlog}
          username={'cyker'}
          handleDeleteBlog={mockDeleteBlog}
        />,
      )
    })

    test('only blog info and likes button are visible', () => {
      expect(
        screen.getByRole('heading', {
          name: `${initialBlog.author}: ${initialBlog.title}`,
        }),
      ).toBeVisible()

      expect(screen.getByRole('button', { name: 'like' })).toBeVisible()

      expect(
        screen.queryByRole('button', { name: 'remove' }),
      ).not.toBeInTheDocument()
    })
  })

  describe('when blog owner logged in', () => {
    beforeEach(() => {
      mockDeleteBlog = vi.fn()
      mockUpdateBlog = vi.fn()
      render(
        <Blog
          blog={initialBlog}
          handleUpdateBlog={mockUpdateBlog}
          username={initialBlog.user.username}
          handleDeleteBlog={mockDeleteBlog}
        />,
      )
    })

    test('all blog info and buttons are visible', () => {
      expect(
        screen.getByRole('heading', {
          name: `${initialBlog.author}: ${initialBlog.title}`,
        }),
      ).toBeVisible()
      expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
    })
  })
})
