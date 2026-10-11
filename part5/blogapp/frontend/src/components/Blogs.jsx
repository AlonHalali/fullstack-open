import BlogForm from './BlogForm'
import Toggleable from './Togglable'
import { Link } from 'react-router-dom'

const Blogs = ({ blogs, name, handleAddBlog, blogFormRef }) => (
  <div>
    <h1>Blogs</h1>
    {name && (
      <>
        <div>{name} logged in</div>
        <br />
        <Toggleable buttonLabel={'create new blog'} ref={blogFormRef}>
          <BlogForm handleAddBlog={handleAddBlog} />
        </Toggleable>{' '}
        <br />
      </>
    )}

    <ul>
      {blogs.map((blog) => (
        <li key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} {blog.author}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

export default Blogs
