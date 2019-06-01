import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({text, action}) => {
  return <div><button type="button" onClick={action}>{text}</button></div>;
}

const Anecdote = ({index, anecdotes, votes}) => (
  <>
    <div>
      {anecdotes[index]}
    </div>
    <div>
      has {votes[index] | 0} votes
    </div>
  </>
)

const App = ({anecdotes}) => {
  const randInt = n => (0 | (n * Math.random()))
  const randAnecdoteIndex = () => (randInt(anecdotes.length))

  const [selected, setSelected] = useState(randAnecdoteIndex())
  const [votes, setVotes] = useState({})

  const voteFor = anecdote => {
    const newVotes = {...votes}
    // set to 1 if doesn't exist, otherwise increment
    newVotes[anecdote] = (newVotes[anecdote] + 1) || 1
    setVotes(newVotes)
  }
  const getWithMostVotes = votes => {
    var [maxIndex, maxPoints] = [0, 0]
    for (var [index, points] of Object.entries(votes)) {
      if (points > maxPoints)
        [maxIndex, maxPoints] = [index, points]
    }
    return maxIndex
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote index={selected} anecdotes={anecdotes} votes={votes} />
      <div>
        <Button text="vote" action={() => voteFor(selected)} />
        <Button text="next anecdote" action={() => setSelected(randAnecdoteIndex())} />
      </div>
      <h1>Anecdote with most votes</h1>
      <Anecdote index={getWithMostVotes(votes)} anecdotes={anecdotes} votes={votes} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)
