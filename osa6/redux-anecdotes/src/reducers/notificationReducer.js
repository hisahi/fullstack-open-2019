const initialNotification = null

const reducer = (state = initialNotification, action) => {
  switch (action.type) {
    case 'NOTIFY':
      return action.data.message
    case 'HIDE':
      return null
    default:
      return state
  }
}

export const showNotification = (message, length) => {
  return async dispatch => {
    dispatch({
      type: 'NOTIFY',
      data: {
        message,
      }
    })
    await new Promise(sleep => setTimeout(sleep, length * 1000))
    dispatch({
      type: 'HIDE'
    })
  }
  return 
}

export default reducer