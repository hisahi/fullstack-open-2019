import React from 'react'
import { connect } from 'react-redux'
import { useField } from '../hooks'
import { createBlog, clearNotify } from '../reducers/blogReducer'
import { showNotification } from '../reducers/notificationReducer'

const CreateBlogForm = (props) => {
  const newBlogTitle = useField('text')
  const newBlogAuthor = useField('text')
  const newBlogUrl = useField('url')

  const handleCreate = async (event) => {
    event.preventDefault()
    const blog = {
      title: newBlogTitle.value,
      author: newBlogAuthor.value,
      url: newBlogUrl.value,
      user: props.user.id
    }
    props.createBlog(props.user, blog)
  }

  if (props.notification.tag === 'createBlog') {
    props.showNotification(props.notification.style, props.notification.message, 5)
    props.clearNotify()
    
    newBlogTitle.reset()
    newBlogAuthor.reset()
    newBlogUrl.reset()
  }

  return (
    <div>
      <form onSubmit={handleCreate}>
        <div>
          title
          <input required name="Title" {...newBlogTitle} reset={null} />
        </div>
        <div>
          author
          <input required name="Author" {...newBlogAuthor} reset={null} />
        </div>
        <div>
          URL
          <input required name="URL" {...newBlogUrl} reset={null} />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    notification: state.blogs.notification
  }
}

const mapDispatchToProps = {
  createBlog,
  clearNotify,
  showNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateBlogForm)
