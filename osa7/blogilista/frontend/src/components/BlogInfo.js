import React from 'react'
import { connect } from 'react-redux'
import Blog from './Blog'
import { showNotification } from '../reducers/notificationReducer'
import { clearNotify } from '../reducers/blogReducer'

const BlogInfo = (props) => {
  if (!props.blog) {
    return null
  }

  if (props.notification.tag === 'likeBlog'
  || props.notification.tag === 'deleteBlog'
  || props.notification.tag === 'addCommentToBlog') {
    props.showNotification(props.notification.style, props.notification.message, 5)
    props.clearNotify()
  }

  return (
    <div>
      <Blog key={props.blog.id} blog={props.blog} showFull={true} />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    self: state.user.user,
    blog: state.blogs.blogs.find(blog => blog.id === ownProps.id),
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
)(BlogInfo)
