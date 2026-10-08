import Blog from './Blog'
import BlogForm from './BlogForm'
import Toggleable from './Togglable'

const Blogs = ({
  blogs,
  name,
  handleLogout,
  handleAddBlog,
  blogFormRef,
  handleUpdateBlog,
  username,
  handleDeleteBlog,
}) => (
  <div>
    {name && <div>{name} logged in</div>}
    <button onClick={handleLogout}>logout</button>
    <br />
    <Toggleable buttonLabel={'create new blog'} ref={blogFormRef}>
      <BlogForm handleAddBlog={handleAddBlog} />
    </Toggleable>

    <br />
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleUpdateBlog={handleUpdateBlog}
          username={username}
          handleDeleteBlog={handleDeleteBlog}
        />
      ))}
    </div>
  </div>
)

export default Blogs
