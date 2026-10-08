import { useState } from 'react'

const Blog = ({ blog }) => {
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
        {blog.title}{' '}
        <button onClick={toggleVisibility}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>
          {blog.likes} <button>like</button>
        </p>
        <p>{blog.author}</p>
      </div>
    </div>
  )
}

export default Blog
