import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { initializeUsers } from '../reducers/userReducer'

const UserInfo = (props) => {
  useEffect(() => {
    props.initializeUsers()
  },[])

  if (!props.user) {
    return null
  }

  return (
    <div>
      <h1>{props.user.name}</h1>
      <h2>added blogs</h2>
      <ul>
        {
          props.blogs.filter(blog => props.user.id === blog.user.id).map(blog =>
            <li key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></li>
          )
        }
      </ul>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    self: state.user.user,
    user: state.user.users.find(user => user.id === ownProps.id),
    blogs: state.blogs.blogs
  }
}

const mapDispatchToProps = {
  initializeUsers
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfo)
