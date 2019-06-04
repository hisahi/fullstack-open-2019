import blogService from '../services/blogs'

const initialBlogState = { blogs: [], notification: {} }

const sortBlogs = (blogs) => {
  blogs.sort((blog1, blog2) => blog2.likes - blog1.likes)
  return blogs
}

const reducer = (state = initialBlogState, action) => {
  switch (action.type) {
  case 'INITIALIZE_BLOGS': {
    const newList = [...action.data]
    return { blogs: sortBlogs(newList), notification: {} }
  }
  case 'NEW_BLOG': {
    const content = action.data
    const newList = [...state.blogs, content]
    return { blogs: sortBlogs(newList), notification: {} }
  }
  case 'UPDATE_BLOG': {
    const changedBlog = { ...action.data.blog, user: action.data.user }
    const newList = state.blogs.map(blog => blog.id !== changedBlog.id ? blog : changedBlog)
    return { blogs: sortBlogs(newList), notification: {} }
  }
  case 'DELETE_BLOG': {
    const blogId = action.data
    const newList = state.blogs.filter(blog => blog.id !== blogId)
    return { blogs: sortBlogs(newList), notification: {} }
  }
  case 'CLEAR_NOTIFY':
    return { ...state, notification: {} }
  case 'BLOG_NOTIFY':
    return { ...state, notification: action.data }
  default:
    return state
  }
}

export const clearNotify = () => {
  return async dispatch => {
    dispatch({
      type: 'CLEAR_NOTIFY'
    })
  }
}

const blogNotify = (tag, style, message) => {
  return async dispatch => {
    dispatch({
      type: 'BLOG_NOTIFY',
      data: {
        tag,
        style,
        message
      },
    })
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const data = await blogService.getAll()
    dispatch({
      type: 'INITIALIZE_BLOGS',
      data,
    })
  }
}

export const createBlog = (user, blog) => {
  return async dispatch => {
    try {
      const object = await blogService.create(user, blog)
      // I'm not proud of this

      dispatch({
        type: 'NEW_BLOG',
        data: object,
      })
      await blogNotify('createBlog', 'success', `blog ${object.title} added`, 5)(dispatch)
    } catch (exception) {
      await blogNotify('createBlog', 'error', 'could not add blog', 5)(dispatch)
    }
  }
}

export const likeBlog = (user, id) => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    const oldBlog = blogs.find(blog => blog.id === id)
    const changedBlog = {
      ...oldBlog,
      likes: oldBlog.likes + 1,
      user: oldBlog.user.id
    }

    try {
      const changedBlogServer = await blogService.update(user, changedBlog)

      dispatch({
        type: 'UPDATE_BLOG',
        data: {
          blog: changedBlogServer,
          user: oldBlog.user
        }
      })
      await blogNotify('likeBlog', 'success', `blog ${oldBlog.title} liked`, 5)(dispatch)
    } catch (exception) {
      await blogNotify('likeBlog', 'error', 'could not like blog', 5)(dispatch)
      return
    }
  }
}

export const deleteBlog = (user, id) => {
  return async dispatch => {
    try {
      const blogs = await blogService.getAll()
      const oldBlog = blogs.find(blog => blog.id === id)
      await blogService.remove(user, id)
      blogNotify('deleteBlog', 'success', `blog ${oldBlog.title} deleted`, 5)
    } catch (e) {
      blogNotify('deleteBlog', 'error', 'could not delete blog', 5)
      return
    }

    dispatch({
      type: 'DELETE_BLOG',
      data: id,
    })
  }
}

export const addCommentToBlog = (user, blogId, comment) => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    const oldBlog = blogs.find(blog => blog.id === blogId)
    const changedBlog = {
      ...oldBlog,
      comments: oldBlog.comments.concat(comment),
      user: oldBlog.user.id
    }

    try {
      const changedBlogServer = await blogService.update(user, changedBlog)

      dispatch({
        type: 'UPDATE_BLOG',
        data: {
          blog: changedBlogServer,
          user: oldBlog.user
        }
      })
      await blogNotify('addCommentToBlog', 'success', 'comment added', 5)(dispatch)
    } catch (exception) {
      await blogNotify('addCommentToBlog', 'error', 'could not add comment', 5)(dispatch)
      return
    }
  }
}

export default reducer