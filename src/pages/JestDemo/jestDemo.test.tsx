// ! USING RTL
import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import JestDemo from '@pages/JestDemo'
import '@testing-library/jest-dom'

describe('JestDemo', () => {
  test('renders component', () => {
    render(<JestDemo id="2" />)

    expect(screen.getByRole('textbox')).toBeInTheDocument()

    screen.debug()
  })

  test('user is rendered', async () => {
    const cb = jest.fn()

    render(<JestDemo id="2" onChange={cb} />)

    await screen.findByText(/User name is/)

    fireEvent.change(screen.getByRole('textbox'), {
      target: {
        value: 'Joni Baez',
      },
    })

    expect(cb).toHaveBeenCalled()
  })
})
