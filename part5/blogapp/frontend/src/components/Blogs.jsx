import Blog from './Blog'

const Blogs = ({ blogs, userName }) => (
  <div>
    <h2>blogs</h2>
    {userName && <div>{userName} logged in</div>}
    <br />
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  </div>
)

export default Blogs
