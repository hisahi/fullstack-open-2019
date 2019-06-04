
const jwt = require("jsonwebtoken")
const router = require("express").Router()
const Blog = require("../models/blog")
const config = require("../utils/config")
const User = require("../models/user")

const getLoginUser = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, config.TOKEN_SECRET)
    if (decodedToken.id) {
      const user = await User.findById(decodedToken.id)
      if (user && user._id) {
        return user
      }
    }
  }
  response.status(401).json({ error: "token missing or invalid" })
  return null
}

router.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs.map(blog => blog.toJSON()))
  } catch (e) {
    next(e)
  }
})

router.post("/", async (request, response, next) => {
  const postBlog = request.body

  try {
    const user = await getLoginUser(request, response, next)
    if (user !== null) {
      const blog = new Blog({ ...postBlog, user: user._id, comments: [] })
      const savedBlog = await blog.save()

      user.blogs = (user.blogs || []).concat(savedBlog._id)
      await user.save()

      response.status(201).json(savedBlog.toJSON())
    }
  } catch (e) {
    next(e)
  }
})

router.put("/:id", async (request, response, next) => {
  const id = request.params.id
  const blog = request.body

  if (blog._id && blog._id !== id) {
    return response.status(400).end()
  }

  try {
    const user = await getLoginUser(request, response, next)
    if (user !== null) {
      const oldBlog = await Blog.findById(id)
      if (oldBlog.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: "not allowed to delete this" })
      }

      const newBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
      response.json(newBlog.toJSON())
    }
  } catch (e) {
    next(e)
  }
})

router.delete("/:id", async (request, response, next) => {
  const id = request.params.id

  try {
    const user = await getLoginUser(request, response, next)
    if (user !== null) {
      const oldBlog = await Blog.findById(id)
      if (oldBlog.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: "not allowed to delete this" })
      }
      await Blog.findByIdAndDelete(id)

      user.blogs = (user.blogs || []).filter(blog => blog.id !== id)
      await user.save()

      response.status(204).end()
    }
  } catch (e) {
    next(e)
  }
})

module.exports = router
