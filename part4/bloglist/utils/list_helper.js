const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? null
    : blogs.reduce(
        (max, blog) => (blog.likes > max.likes ? blog : max),
        blogs[0],
      )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  let authorsMap = {}
  blogs.forEach((blog) => {
    authorsMap[blog.author] = (authorsMap[blog.author] || 0) + 1
  })

  const [topAuthor, maxBlogs] = Object.entries(authorsMap).reduce(
    (max, author) => (author[1] > max[1] ? author : max),
  )

  return { author: topAuthor, blogs: maxBlogs }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  let authorsMap = {}
  blogs.forEach((blog) => {
    authorsMap[blog.author] = (authorsMap[blog.author] || 0) + blog.likes
  })

  const [topAuthor, maxLikes] = Object.entries(authorsMap).reduce(
    (max, author) => (author[1] > max[1] ? author : max),
  )

  return { author: topAuthor, likes: maxLikes }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
