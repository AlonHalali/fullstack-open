import { useState } from 'react'
import { Stack, TextField, Button } from '@mui/material'

const BlogForm = ({ handleAddBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const success = await handleAddBlog({ title, author, url })

    if (success) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            id="filled-title"
            label="Title"
            variant="filled"
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <TextField
            id="filled-author"
            label="Author"
            variant="filled"
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          <TextField
            id="filled-url"
            label="URL"
            variant="filled"
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />

          <Button variant="contained" type="submit">
            create
          </Button>
        </Stack>
      </form>
    </div>
  )
}

export default BlogForm
