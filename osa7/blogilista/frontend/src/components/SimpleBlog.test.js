import React from 'react'
import 'jest-dom/extend-expect'
import { render, cleanup, fireEvent } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'

afterEach(cleanup)

test('SimpleBlog renders content', () => {
  const blog = {
    title: 'blog title',
    author: 'blog author',
    likes: 123,
  }

  const component = render(
    <SimpleBlog blog={blog} onClick={() => 0} />
  )

  expect(component.container).toHaveTextContent(blog.title)
  expect(component.container).toHaveTextContent(blog.author)
  expect(component.container).toHaveTextContent(blog.likes.toString())
})

test('SimpleBlog calls like twice when clicked twice', () => {
  const blog = {
    title: 'blog title',
    author: 'blog author',
    likes: 0,
  }

  const blogLike = () => ++blog.likes

  const component = render(
    <SimpleBlog blog={blog} onClick={blogLike} />
  )
  const like = component.getByText('like')

  fireEvent.click(like)
  fireEvent.click(like)

  expect(blog.likes).toBe(2)
})
