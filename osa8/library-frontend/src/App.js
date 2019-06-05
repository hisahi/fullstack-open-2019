import React, { useState, useEffect } from 'react'
import { Subscription } from 'react-apollo'
import { gql } from 'apollo-boost'
import { useApolloClient, useMutation } from 'react-apollo-hooks'
import LoginForm from './components/LoginForm'
import Authors from './components/Authors'
import Books from './components/Books'
import Recommendations from './components/Recommendations'
import NewBook from './components/NewBook'

const BOOK_ADDED = gql`
subscription {
  bookAdded {   
    title
    author {
      id
      name
    }
    published
    genres
  }
}`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

const App = () => {
  const client = useApolloClient()
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const login = useMutation(LOGIN)

  useEffect(() => {
    const token = window.localStorage.getItem('books-user-token')
    if (token) {
      setToken(token)
    }
  }, [])

  const handleError = (error) => {
    setErrorMessage(error.graphQLErrors[0].message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const errorNotification = () => errorMessage &&
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>

  const loginToken = (token) => {
    setPage('books')
    setToken(token)
    window.localStorage.setItem('books-user-token', token)
  }

  const logout = () => {
    setToken(null)
    window.localStorage.clear()
    client.resetStore()
  }
  
  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={() => setPage('recommend')}>recommendations</button>}
        {token && <button onClick={() => logout()}>logout</button>}
      </div>
      {errorNotification()}

      <Subscription
        subscription={BOOK_ADDED}
        onSubscriptionData={({subscriptionData}) => {
          alert(`New book ${subscriptionData.data.bookAdded.title} added!`)
          client.resetStore()
        }}
      >
        {() => null}
      </Subscription>

      <Authors
        show={page === 'authors'}
        handleError={handleError}
      />

      <Books
        show={page === 'books'}
        handleError={handleError}
      />

      <NewBook
        show={page === 'add'}
        handleError={handleError}
      />

      <Recommendations
        show={page === 'recommend'}
        handleError={handleError}
      />

      <LoginForm
        show={page === 'login'}
        login={login}
        loginToken={(token) => loginToken(token)}
        handleError={handleError}
      />

    </div>
  )
}

export default App
