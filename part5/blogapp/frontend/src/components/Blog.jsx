import { useState } from 'react'

const Blog = ({ blog, handleUpdateBlog, userId, handleDeleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const showWhenVisible = { display: showDetails ? '' : 'none' }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setShowDetails(!showDetails)
  }
  console.log(userId)
  console.log(blog.user)

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}{' '}
        <button onClick={toggleVisibility}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>
          {blog.likes}{' '}
          <button
            onClick={() => handleUpdateBlog({ ...blog, likes: blog.likes + 1 })}
          >
            like
          </button>
        </p>
        <p>{blog.author}</p>
        {blog.user === userId && (
          <button onClick={() => handleDeleteBlog(blog)}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog
