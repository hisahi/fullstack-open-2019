import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { initializeUsers } from '../reducers/userReducer'

const UserList = (props) => {
  useEffect(() => {
    props.initializeUsers()
  },[])

  return (
    <table>
      <thead>
        <td>User</td>
        <td>Blogs</td>
      </thead>
      <tbody>
        {props.users.map(user =>
          <tr key={user.id}>
            <td><Link to={`/users/${user.id}`}>{ user.name }</Link></td>
            <td>{ props.blogs.filter(blog => user.id === blog.user.id).length }</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    users: state.user.users,
    blogs: state.blogs.blogs
  }
}

const mapDispatchToProps = {
  initializeUsers
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList)
