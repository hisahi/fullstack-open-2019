import React from 'react';
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'
import { connect } from 'react-redux'

const AnecdoteList = (props) => {
  const vote = (anecdote) => {
    props.voteAnecdote(anecdote.id)
    props.showNotification(`you voted for '${anecdote.content}'`, 10)
  }
  
  return (
    <div>
      {props.anecdotesToShow.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>)}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    anecdotesToShow: state.anecdotes.filter(anecdote => 
        anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
  }  
}

const mapDispatchToProps = {
  voteAnecdote,
  showNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)
