import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'
describe('<BlogForm />', () => {
  test('add a new blog', async () => {
    const addBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm handleAddBlog={addBlog} />)

    const newBlog = {
      title: 'title test',
      author: 'author test',
      url: 'https://url-test.com',
    }

    const titleInput = screen.getByRole('textbox', { name: 'title:' })
    await user.type(titleInput, newBlog.title)
    const authorInput = screen.getByRole('textbox', { name: 'author:' })
    await user.type(authorInput, newBlog.author)
    const urlInput = screen.getByRole('textbox', { name: 'url:' })
    await user.type(urlInput, newBlog.url)

    const createButton = screen.getByRole('button', { name: 'create' })
    await user.click(createButton)

    const mockClick = addBlog.mock.calls
    const mockArr = mockClick[0][0]

    expect(mockClick).toHaveLength(1)
    expect(mockArr.title).toBe(newBlog.title)
    expect(mockArr.author).toBe(newBlog.author)
    expect(mockArr.url).toBe(newBlog.url)
  })
})
