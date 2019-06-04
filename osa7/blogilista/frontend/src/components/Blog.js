import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { likeBlog, deleteBlog, addCommentToBlog } from '../reducers/blogReducer'

const Blog = (props) => {
  const blog = props.blog

  const handleLike = async (event, blog) => {
    event.stopPropagation()
    props.likeBlog(props.user, blog.id)
  }

  const handleDelete = async (event, blog) => {
    event.stopPropagation()
    if (window.confirm(`Do you want to delete the blog ${blog.title}?`)) {
      props.deleteBlog(props.user, blog.id)
    }
  }

  const handleComment = async (event, blog) => {
    event.preventDefault()
    const commentText = event.target.text.value
    if (commentText) {
      props.addCommentToBlog(props.user, blog.id, commentText)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (props.showFull || false) {
    return (
      <div style={blogStyle}>
        <div>
          <p>{blog.title} by {blog.author}</p>
          <p><a href={blog.url}>{blog.url}</a></p>
          <p>{blog.likes} likes <button type="button" onClick={(e) => handleLike(e, blog)}>like</button></p>
          <p>added by {blog.user.name}</p>
          { props.user !== null && blog.user.username === props.user.username &&
            <p><button type="button" onClick={(e) => handleDelete(e, blog)}>delete</button></p> }
          <h3>comments</h3>
          <form onSubmit={(e) => handleComment(e, blog)}>
            <input name="text" required />
            <input type="submit" value="comment" />
          </form>
          <ul>
            {
              blog.comments.map((comment, index) => <li key={index}>{comment}</li>)
            }
          </ul>
        </div>
      </div>)
  } else {
    return (
      <div style={blogStyle}>
        <div>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> by {blog.author}
        </div>
      </div>)
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  }
}

const mapDispatchToProps = {
  likeBlog,
  deleteBlog,
  addCommentToBlog
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Blog)
