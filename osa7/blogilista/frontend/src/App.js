import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route, Link
} from 'react-router-dom'
import { connect } from 'react-redux'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import BlogList from './components/BlogList'
import UserList from './components/UserList'
import BlogInfo from './components/BlogInfo'
import UserInfo from './components/UserInfo'
import { initializeBlogs } from './reducers/blogReducer'
import { userLoginAuto, userLogout } from './reducers/userReducer'

const App = (props) => {
  const [loginVisible, setLoginVisible] = useState(false)

  const logOut = () => {
    window.localStorage.clear()
    props.userLogout()
  }

  useEffect(() => {
    if (props.user.token) {
      window.localStorage.setItem(
        'loggedBlogAppUser',
        JSON.stringify(props.user))
    }
  })

  useEffect(() => {
    props.initializeBlogs()
  },[])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      props.userLoginAuto(JSON.parse(loggedUserJSON))
    }
  }, [])

  const padding = { padding: 5 }

  const loginForm = () => (
    <div>
      {!loginVisible &&
        <button onClick={() => setLoginVisible(true)}>log in</button>}
      {loginVisible &&
        <>
          <LoginForm />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </>}
    </div>
  )

  const mainView = () => (
    <>
      <div>
        <h2>new blog</h2>
        <CreateBlogForm />
        <h2>blogs</h2>
        <BlogList />
      </div>
    </>
  )

  return (
    <div>
      <Router>
        <div>
          <Notification />
          { props.user.token ?
          <>
            <div>
              <Link style={padding} to="/">blogs</Link>
              <Link style={padding} to="/users">users</Link>
              {props.user.name} ({props.user.username}) logged in.
              <button type="button" onClick={logOut}>log out</button>
            </div>
            <Route exact path="/" render={() => mainView()} />
            <Route exact path="/users" render={() => <UserList />} />
            <Route exact path="/users/:id" render={({ match }) => <UserInfo id={match.params.id} />} />
            <Route exact path="/blogs/:id" render={({ match }) => <BlogInfo id={match.params.id} />} />
          </> :
            loginForm() }
        </div>
      </Router>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  }
}

const mapDispatchToProps = {
  initializeBlogs,
  userLoginAuto,
  userLogout
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
