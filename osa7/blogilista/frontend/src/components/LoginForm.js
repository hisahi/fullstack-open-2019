import React from 'react'
import { connect } from 'react-redux'
import { showNotification } from '../reducers/notificationReducer'
import { useField } from '../hooks'
import { userLogin, clearNotify } from '../reducers/userReducer'

const LoginForm = (props) => {
  const username = useField('text')
  const password = useField('password')

  const handleLogin = async (event) => {
    event.preventDefault()

    const user = {
      username: username.value,
      password: password.value,
    }

    username.reset()
    password.reset()

    props.userLogin(user)
  }

  if (props.notification.tag === 'login') {
    props.showNotification(props.notification.style, props.notification.message, 5)
    props.clearNotify()
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            name="Username"
            {...username}
            reset={null}
          />
        </div>
        <div>
          password
          <input
            name="Password"
            {...password}
            reset={null}
          />
        </div>
        <button type="submit">log in</button>
      </form>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    notification: state.user.notification
  }
}

const mapDispatchToProps = {
  showNotification,
  clearNotify,
  userLogin
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm)
