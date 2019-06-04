import React from 'react'
import { connect } from 'react-redux'

const Notification = ({ style, message }) => {
  if (!message) {
    return null
  }

  return (
    <div className={style}>
      {message}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    style: state.notification.style,
    message: state.notification.message
  }
}

const mapDispatchToProps = {
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notification)
