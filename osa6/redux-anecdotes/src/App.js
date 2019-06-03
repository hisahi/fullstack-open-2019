import React, { useEffect } from 'react';
import Notification from './components/Notification'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import { initializeNotes } from './reducers/anecdoteReducer'
import { connect } from 'react-redux'

const App = (props) => {
  useEffect(() => {
    props.initializeNotes()
  },[])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  ) 
}

export default connect(null, { initializeNotes })(App)
