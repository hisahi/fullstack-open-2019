import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from 'react-apollo-hooks'

export const ALL_AUTHORS = gql`
{
  allAuthors {
    name
    born
    bookCount
  }
}
`

const SET_BORN = gql`
mutation setBorn($name: String!, $born: Int!) {
  editAuthor(name: $name, setBornTo: $born) {
    name
    born
  }
}
`

const Authors = (props) => {
  const [formAuthor, setFormAuthor] = useState('')
  const [formYear, setFormYear] = useState('')

  const result = useQuery(ALL_AUTHORS)
  const editAuthor = useMutation(SET_BORN, 
    {   
      refetchQueries: [
        { query: ALL_AUTHORS },
      ]  
    }
  )
  
  if (!props.show) {
    return null
  }

  const submitAuthorYear = async (e) => {
    e.preventDefault()
    
    await editAuthor({ variables: {
      name: formAuthor,
      born: Number(formYear)
    }})

    setFormAuthor('')
    setFormYear('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {(result.data.allAuthors || []).map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={submitAuthorYear}>
        <div>
          name
          <select
            value={formAuthor}
            onChange={({ target }) => setFormAuthor(target.value)}>
            {
              (result.data.allAuthors || []).map(a =>
                <option key={a.name} value={a.name}>{a.name}</option>
              )
            }  
          </select>
        </div>
        <div>
          born
          <input
            type='number'
            value={formYear}
            onChange={({ target }) => setFormYear(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors