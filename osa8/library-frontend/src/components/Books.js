import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from 'react-apollo-hooks'
import unique from 'array-unique'

export const ALL_BOOKS = gql`
{
  allBooks {
    title
    author {
      id
      name
    }
    published
    genres
  }
}
`

const Books = (props) => {
  const [filterGenre, setFilterGenre] = useState('')
  const result = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  const listOfGenres = () => {
    return unique(
      [].concat.apply([], 
        (result.data.allBooks || [])
          .map(book => book.genres))
    )
  }

  return (
    <div>
      <h2>books</h2>

      {filterGenre && <p>in genre <b>{filterGenre}</b></p>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {(result.data.allBooks || [])
            .filter(book => !filterGenre || book.genres.includes(filterGenre))
            .map(a =>
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            )}
        </tbody>
      </table>

      {(listOfGenres().map(genre => 
        <button key={genre} type="button" onClick={() => setFilterGenre(genre)}>{genre}</button>
      ))}
      <button type="button" onClick={() => setFilterGenre("")}>all genres</button>
    </div>
  )
}

export default Books