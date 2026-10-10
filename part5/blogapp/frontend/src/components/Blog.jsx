import { useState } from 'react'

const Blog = ({ blog, handleUpdateBlog, username, handleDeleteBlog }) => {
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

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>
          <span className="likes-count">{blog.likes} </span>
          <button
            onClick={() => handleUpdateBlog({ ...blog, likes: blog.likes + 1 })}
          >
            like
          </button>
        </p>
        {blog.user.username === username && (
          <button onClick={() => handleDeleteBlog(blog)}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog
