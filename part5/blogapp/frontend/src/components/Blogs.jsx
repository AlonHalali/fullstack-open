import { Link } from 'react-router-dom'

const Blogs = ({ blogs, name }) => (
  <div>
    <h1>Blogs</h1>
    {name && <div>{name} logged in</div>}

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
