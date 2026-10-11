const Blog = ({ blog, handleUpdateBlog, username, handleDeleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    marginBottom: 5,
  }

  if (!blog) return null

  return (
    <div style={blogStyle}>
      <h2>
        {blog.title} {blog.author}
      </h2>

      <a href={blog.url}>{blog.url}</a>
      <br />

      <span className="likes-count">likes {blog.likes} </span>

      {username && (
        <button
          onClick={() => handleUpdateBlog({ ...blog, likes: blog.likes + 1 })}
        >
          like
        </button>
      )}
      <br />

      <span>Added by {blog.user.name}</span>
      <br />

      {blog.user.username === username && (
        <button onClick={() => handleDeleteBlog(blog)}>remove</button>
      )}
    </div>
  )
}

export default Blog
