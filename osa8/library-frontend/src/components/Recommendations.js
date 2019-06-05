import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from 'react-apollo-hooks'

const ALL_BOOKS = gql`
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

const ME = gql`
{
  me {
    favoriteGenre
  }
}
`

const Recommendations = (props) => {
  const result = useQuery(ALL_BOOKS)
  const me = useQuery(ME)

  if (!props.show) {
    return null
  }

  const genre = me.data.me.favoriteGenre || ''

  return (
    <div>
      <h2>recommendations</h2>

      <p>books in your favorite genre <b>{genre}</b></p>

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
            .filter(book => book.genres.includes(genre))
            .map(a =>
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations