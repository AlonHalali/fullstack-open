import { Paper, Button, Typography, Stack } from '@mui/material'

const Blog = ({ blog, handleUpdateBlog, username, handleDeleteBlog }) => {
  if (!blog) return null

  return (
    <Paper elevation={3} sx={{ my: 3, p: 3 }}>
      {' '}
      <Stack spacing={1}>
        {' '}
        <Typography variant="h5" component="h2">
          {blog.title}{' '}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          by {blog.author}
        </Typography>
        <Typography variant="body1">
          <a href={blog.url}>{blog.url}</a>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Added by {blog.user.name}
        </Typography>
        <Typography variant="body1" className="likes-count">
          {blog.likes} likes
        </Typography>
        <Stack direction="row" spacing={1}>
          {username && (
            <Button
              variant="outlined"
              onClick={() =>
                handleUpdateBlog({ ...blog, likes: blog.likes + 1 })
              }
            >
              like
            </Button>
          )}

          {blog.user.username === username && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDeleteBlog(blog)}
            >
              remove
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  )
}

export default Blog
