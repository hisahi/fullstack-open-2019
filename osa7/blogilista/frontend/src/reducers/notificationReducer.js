const initialNotification = { style: '', message: '' }

const reducer = (state = initialNotification, action) => {
  switch (action.type) {
  case 'NOTIFY':
    return action.data
  case 'HIDE':
    return initialNotification
  default:
    return state
  }
}

export const showNotification = (style, message, length) => {
  return async dispatch => {
    dispatch({
      type: 'NOTIFY',
      data: {
        style,
        message,
      }
    })
    await new Promise(sleep => setTimeout(sleep, length * 1000))
    dispatch({
      type: 'HIDE'
    })
  }
}

export default reducer