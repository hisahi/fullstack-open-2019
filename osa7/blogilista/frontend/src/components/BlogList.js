import React from 'react'
import { connect } from 'react-redux'
import Blog from './Blog'
import { showNotification } from '../reducers/notificationReducer'
import { clearNotify } from '../reducers/blogReducer'

const BlogList = (props) => {
  if (props.notification.tag === 'likeBlog'
  || props.notification.tag === 'deleteBlog'
  || props.notification.tag === 'addCommentToBlog') {
    props.showNotification(props.notification.style, props.notification.message, 5)
    props.clearNotify()
  }

  return (
    <div>
      {props.blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs.blogs,
    notification: state.blogs.notification
  }
}

const mapDispatchToProps = {
  showNotification,
  clearNotify
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlogList)
