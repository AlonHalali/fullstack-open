import Blog from './Blog'
import BlogForm from './BlogForm'

const Blogs = ({ blogs, userName, handleLogout, handleAddBlog }) => (
  <div>
    <h2>blogs</h2>
    {userName && (
      <div>
        {userName} logged in <button onClick={handleLogout}>logout</button>
      </div>
    )}
    <br />
    <BlogForm handleAddBlog={handleAddBlog} />
    <br />
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  </div>
)

export default Blogs
