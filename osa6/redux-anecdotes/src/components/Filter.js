import React from 'react'
import { setSearchFilter } from '../reducers/filterReducer'
import { connect } from 'react-redux'

const Filter = (props) => {
  const handleChange = (event) => {
    props.setSearchFilter(event.target.value)
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input name="filter" onChange={handleChange} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {}  
}

const mapDispatchToProps = {
  setSearchFilter
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter)
