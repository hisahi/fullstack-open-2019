import anecdoteService from '../services/anecdotes'

const sortVotes = (list) => {
  list.sort((a1, a2) => a2.votes - a1.votes)
  return list
}

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE': {
      const changedAnecdote = action.data
      const newList = state.map(anecdote => anecdote.id !== changedAnecdote.id ? anecdote : changedAnecdote)
      return sortVotes(newList)
    }
    case 'ADD_NEW': {
      const content = action.data
      const newList = [...state, content]
      return sortVotes(newList)
    }
    case 'INITIALIZE': {
      const newList = [...action.data]
      return sortVotes(newList)
    }
    default:
      return state
  }
}

export const voteAnecdote = id => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    const oldAnecdote = anecdotes.find(anecdote => anecdote.id === id)
    const changedAnecdote = { 
      ...oldAnecdote, 
      votes: oldAnecdote.votes + 1 
    }
    const object = await anecdoteService.update(changedAnecdote)
    dispatch({
      type: 'UPDATE',
      data: object,
    })
  }
}

export const createAnecdote = anecdote => {
  return async dispatch => {
    const object = await anecdoteService.createNew(anecdote)
    dispatch({
      type: 'ADD_NEW',
      data: object,
    })
  }
}

export const initializeNotes = data => {
  return async dispatch => {
    const data = await anecdoteService.getAll()
    dispatch({
      type: 'INITIALIZE',
      data,
    })
  }
}

export default reducer