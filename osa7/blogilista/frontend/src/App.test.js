import React from 'react'
import { render, waitForElement } from '@testing-library/react'
jest.mock('./services/blogs')
import App from './App'
import 'jest-dom/extend-expect'

describe('<App />', () => {
  it('only displays a log in page if not logged in', async () => {
    const component = render(
      <App />
    )
    component.rerender(<App />)

    await waitForElement(
      () => component.getByText('log in')
    )

    expect(component.container).toHaveTextContent(
      'log in'
    )
    expect(component.container).not.toHaveTextContent(
      'HTML on helppoa'
    )
  })

  describe('when logged in', () => {
    beforeEach(() => {
      const user = {
        username: 'tester',
        token: '1231231214',
        name: 'Teuvo Testaaja'
      }
      localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
    })

    it('displays all blogs', async () => {
      const component = render(
        <App />
      )
      component.rerender(<App />)

      await waitForElement(
        () => component.getByText(/HTML/i)
      )
      await waitForElement(
        () => component.getByText(/pystyy/i)
      )
      await waitForElement(
        () => component.getByText(/GET ja POST/i)
      )
      expect(component.container).toHaveTextContent(
        'HTML on helppoa'
      )
      expect(component.container).toHaveTextContent(
        'Selain pystyy suorittamaan vain javascriptiä'
      )
      expect(component.container).toHaveTextContent(
        'HTTP-protokollan tärkeimmät metodit ovat GET ja POST'
      )
    })
  })
})