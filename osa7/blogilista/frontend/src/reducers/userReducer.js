import userService from '../services/login'

const initialUserState = { user: {}, notification: {}, users: [] }

const reducer = (state = initialUserState, action) => {
  switch (action.type) {
  case 'INITIALIZE_USERS':
    return { ...state, users: action.data }
  case 'USER_LOGIN':
    return { ...state, user: action.data }
  case 'USER_READY':
    return { ...state, user: action.data }
  case 'USER_LOGOUT':
    return { ...state, user: {} }
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

const userNotify = (tag, style, message) => {
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

export const userLogin = credentials => {
  return async dispatch => {
    try {
      const object = await userService.login(credentials)
      // I'm not proud of this

      dispatch({
        type: 'USER_LOGIN',
        data: object,
      })
    } catch (exception) {
      await userNotify('login', 'error', 'invalid username or password', 5)(dispatch)
    }
  }
}

export const userLoginAuto = user => {
  return async dispatch => {
    dispatch({
      type: 'USER_READY',
      data: user,
    })
  }
}

export const userLogout = () => {
  return async dispatch => {
    dispatch({
      type: 'USER_LOGOUT'
    })
  }
}

export const initializeUsers = () => {
  return async dispatch => {
    const data = await userService.getAll()
    dispatch({
      type: 'INITIALIZE_USERS',
      data,
    })
  }
}

export default reducer