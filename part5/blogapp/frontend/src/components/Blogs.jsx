import Blog from './Blog'
import BlogForm from './BlogForm'
import Toggleable from './Togglable'

const Blogs = ({
  blogs,
  userName,
  handleLogout,
  handleAddBlog,
  blogFormRef,
  handleUpdateBlog,
  userId,
  handleDeleteBlog,
}) => (
  <div>
    {userName && (
      <div>
        {userName} logged in <button onClick={handleLogout}>logout</button>
      </div>
    )}
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
          userId={userId}
          handleDeleteBlog={handleDeleteBlog}
        />
      ))}
    </div>
  </div>
)

export default Blogs
